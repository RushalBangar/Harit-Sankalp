import { db, storage, isFirebaseConfigured } from './firebase';
import { 
  collection, doc, getDocs, getDoc, setDoc, updateDoc, 
  query, where, addDoc, increment 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DEFAULT_PLANTS, DEFAULT_PICKUP_POINTS, DEFAULT_BUSINESSES } from './mockData';

// KEYS FOR LOCAL STORAGE MOCK
const ORDERS_KEY = 'harit_orders';
const PICKUP_POINTS_KEY = 'harit_pickup_points';
const USERS_KEY = 'harit_users';
const QR_CODES_KEY = 'harit_qrcodes';

// Seeding helper for mock storage
const seedMockDatabase = () => {
  if (!localStorage.getItem(PICKUP_POINTS_KEY)) {
    localStorage.setItem(PICKUP_POINTS_KEY, JSON.stringify(DEFAULT_PICKUP_POINTS));
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(QR_CODES_KEY)) {
    localStorage.setItem(QR_CODES_KEY, JSON.stringify([]));
  }
};
seedMockDatabase();

// LocalStorage helpers
const getFromLocal = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveToLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const dbService = {
  // Fetch available plants
  getPlants: async () => {
    if (isFirebaseConfigured) {
      try {
        const querySnapshot = await getDocs(collection(db, 'plants'));
        const plants = [];
        querySnapshot.forEach((doc) => {
          plants.push({ id: doc.id, ...doc.data() });
        });
        return plants.length > 0 ? plants : DEFAULT_PLANTS;
      } catch (err) {
        console.error("Firestore getPlants error, using default data: ", err);
        return DEFAULT_PLANTS;
      }
    } else {
      return DEFAULT_PLANTS;
    }
  },

  // Fetch pickup points
  getPickupPoints: async () => {
    if (isFirebaseConfigured) {
      const querySnapshot = await getDocs(collection(db, 'pickupPoints'));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    } else {
      return getFromLocal(PICKUP_POINTS_KEY);
    }
  },

  // Fetch partner businesses
  getBusinesses: async () => {
    if (isFirebaseConfigured) {
      const querySnapshot = await getDocs(collection(db, 'businesses'));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list.length > 0 ? list : DEFAULT_BUSINESSES;
    } else {
      return DEFAULT_BUSINESSES;
    }
  },

  // Order a tree sapling
  createOrder: async (userId, userName, plantId, plantName, pickupPointId, pickupPointName) => {
    const orderData = {
      plantId,
      plantName,
      userId,
      userName,
      pickupPointId,
      pickupPointName,
      status: 'ordered', // 'ordered', 'picked_up', 'planted'
      orderedAt: new Date().toISOString(),
      pickedUpAt: null,
      plantedAt: null,
      image: null,
      gpsCoordinates: null,
      verificationStatus: 'pending', // 'pending', 'verified', 'rejected'
      pointsAwarded: false
    };

    if (isFirebaseConfigured) {
      // 1. Create order
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // 2. Decrement nursery stock
      const stockRef = doc(db, 'pickupPoints', pickupPointId);
      await updateDoc(stockRef, {
        [`stock.${plantId}`]: increment(-1)
      });

      return { id: docRef.id, ...orderData };
    } else {
      // Mock logic
      const orders = getFromLocal(ORDERS_KEY);
      const orderId = 'order_' + Math.random().toString(36).substr(2, 9);
      const newOrder = { id: orderId, ...orderData };
      orders.push(newOrder);
      saveToLocal(ORDERS_KEY, orders);

      // Decrement nursery stock
      const points = getFromLocal(PICKUP_POINTS_KEY);
      const updatedPoints = points.map(pt => {
        if (pt.id === pickupPointId) {
          return {
            ...pt,
            stock: {
              ...pt.stock,
              [plantId]: Math.max(0, (pt.stock[plantId] || 1) - 1)
            }
          };
        }
        return pt;
      });
      saveToLocal(PICKUP_POINTS_KEY, updatedPoints);

      return newOrder;
    }
  },

  // Fetch orders (Filter by user role/id)
  getOrders: async (userId, role) => {
    if (isFirebaseConfigured) {
      let q;
      if (role === 'government') {
        q = collection(db, 'orders');
      } else {
        q = query(collection(db, 'orders'), where('userId', '==', userId));
      }
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    } else {
      const orders = getFromLocal(ORDERS_KEY);
      if (role === 'government') {
        return orders;
      }
      return orders.filter(order => order.userId === userId);
    }
  },

  // Update order status (For government pickup confirmation)
  updateOrderStatus: async (orderId, status) => {
    const updateData = {
      status,
      [`${status}At`]: new Date().toISOString()
    };

    if (isFirebaseConfigured) {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, updateData);
      return { id: orderId, ...updateData };
    } else {
      const orders = getFromLocal(ORDERS_KEY);
      const updatedOrders = orders.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            [`${status}At`]: new Date().toISOString()
          };
        }
        return ord;
      });
      saveToLocal(ORDERS_KEY, updatedOrders);
      return { id: orderId, status };
    }
  },

  // Upload plantation verification photo and EXIF coordinates
  verifyPlantation: async (orderId, file, gpsCoordinates) => {
    let imageUrl = '';
    
    if (isFirebaseConfigured) {
      // 1. Upload to storage
      const fileRef = ref(storage, `plantations/${orderId}_${Date.now()}.jpg`);
      await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(fileRef);

      // 2. Update order with image and GPS, and trigger auto-verification
      const orderRef = doc(db, 'orders', orderId);
      const updateData = {
        image: imageUrl,
        gpsCoordinates,
        status: 'planted',
        plantedAt: new Date().toISOString(),
        verificationStatus: 'verified' // Auto verified in this simulation
      };
      await updateDoc(orderRef, updateData);

      // 3. Award points to user
      const orderDoc = await getDoc(orderRef);
      const userId = orderDoc.data().userId;
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        points: increment(100) // 100 points per tree
      });

      return { imageUrl, verificationStatus: 'verified' };
    } else {
      // Mock File Upload (Convert File to Base64)
      imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const orders = getFromLocal(ORDERS_KEY);
      let targetUserId = '';
      
      const updatedOrders = orders.map(ord => {
        if (ord.id === orderId) {
          targetUserId = ord.userId;
          return {
            ...ord,
            image: imageUrl,
            gpsCoordinates,
            status: 'planted',
            plantedAt: new Date().toISOString(),
            verificationStatus: 'verified'
          };
        }
        return ord;
      });
      saveToLocal(ORDERS_KEY, updatedOrders);

      // Reward User with Points in LocalStorage
      if (targetUserId) {
        const users = getFromLocal(USERS_KEY);
        // Users key holds an object keyed by email, let's update by finding uid
        let foundEmail = '';
        Object.keys(users).forEach(email => {
          if (users[email].uid === targetUserId) {
            foundEmail = email;
          }
        });

        if (foundEmail) {
          users[foundEmail].points = (users[foundEmail].points || 0) + 100;
          saveToLocal(USERS_KEY, users);
          
          // Update current user session
          const currUser = JSON.parse(localStorage.getItem('harit_current_user'));
          if (currUser && currUser.uid === targetUserId) {
            currUser.points = (currUser.points || 0) + 100;
            localStorage.setItem('harit_current_user', JSON.stringify(currUser));
          }
        }
      }

      return { imageUrl, verificationStatus: 'verified' };
    }
  },

  // QR Discount operations
  generateDiscountQR: async (userId, userEmail, discountValue, businessId, businessName) => {
    const qrcodeVal = 'HS-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 Hours expiry

    const qrData = {
      code: qrcodeVal,
      userId,
      userEmail,
      discountValue, // e.g. "15% OFF"
      businessId,
      businessName,
      status: 'active', // 'active', 'redeemed', 'expired'
      createdAt: new Date().toISOString(),
      expiresAt,
      redeemedAt: null
    };

    if (isFirebaseConfigured) {
      await addDoc(collection(db, 'qrcodes'), qrData);
      
      // Deduct 100 points for generating discount code
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        points: increment(-100)
      });

      return qrData;
    } else {
      const qrs = getFromLocal(QR_CODES_KEY);
      qrs.push(qrData);
      saveToLocal(QR_CODES_KEY, qrs);

      // Deduct 100 points locally
      const users = getFromLocal(USERS_KEY);
      let foundEmail = '';
      Object.keys(users).forEach(email => {
        if (users[email].uid === userId) {
          foundEmail = email;
        }
      });

      if (foundEmail) {
        users[foundEmail].points = Math.max(0, (users[foundEmail].points || 0) - 100);
        saveToLocal(USERS_KEY, users);

        const currUser = JSON.parse(localStorage.getItem('harit_current_user'));
        if (currUser && currUser.uid === userId) {
          currUser.points = Math.max(0, (currUser.points || 0) - 100);
          localStorage.setItem('harit_current_user', JSON.stringify(currUser));
        }
      }

      return qrData;
    }
  },

  // Scan and Redeem QR code (For Business dashboard)
  redeemQR: async (code, businessId) => {
    if (isFirebaseConfigured) {
      const q = query(
        collection(db, 'qrcodes'), 
        where('code', '==', code)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Invalid QR Code');
      }

      let qrDocId = '';
      let qrData = null;
      querySnapshot.forEach((doc) => {
        qrDocId = doc.id;
        qrData = doc.data();
      });

      if (qrData.status !== 'active') {
        throw new Error(`QR Code is already ${qrData.status}`);
      }

      if (qrData.businessId !== businessId) {
        throw new Error('This QR Code belongs to another business partner');
      }

      if (new Date(qrData.expiresAt) < new Date()) {
        const qrRef = doc(db, 'qrcodes', qrDocId);
        await updateDoc(qrRef, { status: 'expired' });
        throw new Error('QR Code has expired');
      }

      const qrRef = doc(db, 'qrcodes', qrDocId);
      await updateDoc(qrRef, {
        status: 'redeemed',
        redeemedAt: new Date().toISOString()
      });

      return { ...qrData, status: 'redeemed', redeemedAt: new Date().toISOString() };
    } else {
      const qrs = getFromLocal(QR_CODES_KEY);
      const qrIndex = qrs.findIndex(q => q.code === code);

      if (qrIndex === -1) {
        throw new Error('Invalid QR Code');
      }

      const qr = qrs[qrIndex];

      if (qr.status !== 'active') {
        throw new Error(`QR Code is already ${qr.status}`);
      }

      if (qr.businessId !== businessId) {
        throw new Error('This QR Code belongs to another business partner');
      }

      if (new Date(qr.expiresAt) < new Date()) {
        qr.status = 'expired';
        saveToLocal(QR_CODES_KEY, qrs);
        throw new Error('QR Code has expired');
      }

      qr.status = 'redeemed';
      qr.redeemedAt = new Date().toISOString();
      saveToLocal(QR_CODES_KEY, qrs);

      return qr;
    }
  },

  // Get list of QR codes created/redeemed by user/business
  getQRCodes: async (id, role) => {
    if (isFirebaseConfigured) {
      let q;
      if (role === 'business') {
        q = query(collection(db, 'qrcodes'), where('businessId', '==', id));
      } else {
        q = query(collection(db, 'qrcodes'), where('userId', '==', id));
      }
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    } else {
      const qrs = getFromLocal(QR_CODES_KEY);
      if (role === 'business') {
        return qrs.filter(q => q.businessId === id);
      }
      return qrs.filter(q => q.userId === id);
    }
  },

  // Admin: Update Stock of Pickup Point (For Government dashboard)
  updateNurseryStock: async (pickupPointId, plantId, quantity) => {
    if (isFirebaseConfigured) {
      const stockRef = doc(db, 'pickupPoints', pickupPointId);
      await updateDoc(stockRef, {
        [`stock.${plantId}`]: quantity
      });
      return { pickupPointId, plantId, quantity };
    } else {
      const points = getFromLocal(PICKUP_POINTS_KEY);
      const updatedPoints = points.map(pt => {
        if (pt.id === pickupPointId) {
          return {
            ...pt,
            stock: {
              ...pt.stock,
              [plantId]: quantity
            }
          };
        }
        return pt;
      });
      saveToLocal(PICKUP_POINTS_KEY, updatedPoints);
      return { pickupPointId, plantId, quantity };
    }
  }
};
