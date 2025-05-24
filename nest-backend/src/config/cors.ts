export const corsConfig = {
  // origin: ['https://emr-uat.weal.app', 'http://localhost:4200', 'https://emr.weal.app'],  // Or specific origins like ['http://localhost:3000']
  origin: true,
  // Allow all HTTP methods 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  
  // Allow all headers - the key setting you asked for
  allowedHeaders: "*",
  
  // Allow credentials (if using specific origins)
  credentials: true,
  
  // Additional recommended settings
  exposedHeaders: "*", // Expose all headers to client
  maxAge: 86_400, // 24 hour preflight cache
  preflightContinue: false,
  optionsSuccessStatus: 204,
  strictPreflight: false 
};