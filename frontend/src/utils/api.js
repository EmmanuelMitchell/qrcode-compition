// // const API_BASE_URL = 'http://localhost:3001/api';


// // export const api = {
// //   async recordScan(shopId, phoneNumber) {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/scans`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ shopId, phoneNumber }),
// //       });
      
// //       if (!response.ok) {
// //         throw new Error('Failed to record scan');
// //       }
      
// //       return await response.json();
// //     } catch (error) {
// //       console.error('API Error:', error);
// //       throw error;
// //     }
// //   },

// //   async getDashboardData() {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/dashboard`);
      
// //       if (!response.ok) {
// //         throw new Error('Failed to fetch dashboard data');
// //       }
      
// //       return await response.json();
// //     } catch (error) {
// //       console.error('API Error:', error);
// //       throw error;
// //     }
// //   },

// //   async getShopData(shopId) {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/shops/${shopId}`);
      
// //       if (!response.ok) {
// //         throw new Error('Failed to fetch shop data');
// //       }
      
// //       return await response.json();
// //     } catch (error) {
// //       console.error('API Error:', error);
// //       throw error;
// //     }
// //   }
// // };



// // const API_BASE_URL = 'http://localhost:3001/api';
// // const API_BASE_URL = `${import.meta.env.process.env.REACT_APP_BACKEND_URL}/api`;
// const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;
// console.log(API_BASE_URL);





// export const api = {
//   /**
//    * Record a new scan for a shop
//    * @param {string} shopId - Format: "{name}-{platform}" (e.g., "bo-android")
//    * @param {string} phoneNumber - User's phone number
//    * @returns {Promise<{scan: Object, redirectUrl: string}>}
//    */
//   async recordScan(shopId, phoneNumber) {
   
//     try {
//       const response = await fetch(`${API_BASE_URL}/scans`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ shopId, phoneNumber }),
//       });
  
//       const responseData = await response.json(); // Capture response data
//       console.log(response)
  
//       if (!response.ok) {
//         console.error('API Response Error:', responseData);
//         throw new Error(responseData.error || 'Failed to record scan');
//       }
  
//       return responseData; // Returns { scan, redirectUrl }
//     } catch (error) {
//       console.error('API Error:', error.message);
//       throw error;
//     }
//   },

//   /**
//    * Get dashboard data for all shops
//    * @returns {Promise<Array<{
//    *   id: string,
//    *   name: string,
//    *   platform: string,
//    *   url: string,
//    *   scanCount: number,
//    *   uniquePhoneNumbers: number,
//    *   qrUrl: string
//    * }>>}
//    */
//   async getDashboardData() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/dashboard`);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch dashboard data');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get data for a specific shop
//    * @param {string} shopId - Format: "{name}-{platform}" (e.g., "bo-android")
//    * @returns {Promise<Object>}
//    */
//   async getShopData(shopId) {
   

//     try {
//       const response = await fetch(`${API_BASE_URL}/dashboard`);
//       const responseData = await response.json();
//       console.log(responseData)
  
//       // if (!response.ok) {
//       //   console.error('Dashboard API Error:', responseData);
//       //   throw new Error(responseData.error || 'Failed to fetch dashboard data');
//       // }
  
//       return responseData;
//     } catch (error) {
//       console.error('API Error:', error.message);
//       throw error;
//     }
//   },

//   /**
//    * Get shop by name and platform
//    * @param {string} name - Shop name (e.g., "bo")
//    * @param {string} platform - Platform type ("android" or "iphone")
//    * @returns {Promise<Object>}
//    */
//   async getShopByNameAndPlatform(name, platform) {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/shops/lookup/${name.toLowerCase()}/${platform.toLowerCase()}`
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch shop data');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   },

//   /**
//    * Generate QR code URL for a shop
//    * @param {string} name - Shop name
//    * @param {string} platform - Platform type ("android" or "iphone")
//    * @returns {string}
//    */
//   generateQRUrl(name, platform) {
//     const baseUrl = window.location.origin;
//     const shopId = `${name.toLowerCase()}-${platform.toLowerCase()}`;
//     return `${baseUrl}/scan/${shopId}`;
//   }
// };


const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;
console.log(API_BASE_URL);

export const api = {
  /**
   * Record a new scan for a shop
   * @param {string} shopId - Format: "{name}-{platform}" (e.g., "bo-android")
   * @param {string} phoneNumber - User's phone number
   * @returns {Promise<{scan: Object, redirectUrl: string}>}
   */
  async recordScan(shopId, phoneNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/scans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shopId, phoneNumber }),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to record scan');
      }

      return responseData;
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  },

  /**
   * Get dashboard data for all shops
   * @returns {Promise<Array<Object>>}
   */
  async getDashboardData() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to fetch dashboard data');
      }

      return responseData;
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  },

  /**
   * Get data for a specific shop
   * @param {string} shopId - Format: "{name}-{platform}" (e.g., "bo-android")
   * @returns {Promise<Object>}
   */
  async getShopData(shopId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/${shopId}`);
      const responseData = await response.json();
      console.log('Shop Data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to fetch shop data');
      }

      return responseData;
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  },

  /**
   * Get shop details by name and platform
   * @param {string} name - Shop name (e.g., "bo")
   * @param {string} platform - Platform type ("android" or "iphone")
   * @returns {Promise<Object>}
   */
  async getShopByNameAndPlatform(name, platform) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shops/lookup/${name.toLowerCase()}/${platform.toLowerCase()}`
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to fetch shop data');
      }

      return responseData;
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  },

  /**
   * Generate QR code URL for a shop
   * @param {string} name - Shop name
   * @param {string} platform - Platform type ("android" or "iphone")
   * @returns {string}
   */
  generateQRUrl(name, platform) {
    const baseUrl = window.location.origin;
    const shopId = `${name.toLowerCase()}-${platform.toLowerCase()}`;
    return `${baseUrl}/scan?shopId=${shopId}`; // Corrected URL format
  },
};
