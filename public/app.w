// Nest and Nurture Cleaning - Wing Application
// Residential housekeeping service booking system

bring cloud;
bring http;
bring util;

// Cloud resources
let api = new cloud.Api();
let servicesBucket = new cloud.Bucket(name: "services");
let bookingsBucket = new cloud.Bucket(name: "bookings");
let counter = new cloud.Counter();

// Service data structure
struct Service {
  id: num;
  name: str;
  description: str;
  price: num;
  duration: num;
}

// Booking data structure
struct Booking {
  id: num;
  firstName: str;
  lastName: str;
  email: str;
  phone: str;
  address: str;
  city: str;
  state: str;
  zipCode: str;
  serviceId: num;
  bookingDate: str;
  bookingTime: str;
  notes: str;
  status: str;
  createdAt: str;
}

// Initialize default services
let initServices = inflight () => {
  let services = [
    Json {
      id: 1,
      name: "Basic Cleaning",
      description: "Standard house cleaning service",
      price: 100,
      duration: 120
    },
    Json {
      id: 2,
      name: "Deep Cleaning",
      description: "Comprehensive deep cleaning service",
      price: 200,
      duration: 240
    },
    Json {
      id: 3,
      name: "Move In/Out Cleaning",
      description: "Complete cleaning for moving",
      price: 300,
      duration: 360
    }
  ];
  
  servicesBucket.put("services.json", Json.stringify(services));
};

// API Endpoints

// GET /api/services - Get all available services
api.get("/api/services", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  try {
    let servicesData = servicesBucket.get("services.json");
    let services = Json.parse(servicesData);
    
    return cloud.ApiResponse {
      status: 200,
      headers: {
        "Content-Type" => "application/json",
        "Access-Control-Allow-Origin" => "*"
      },
      body: Json.stringify(Json {
        success: true,
        services: services
      })
    };
  } catch e {
    return cloud.ApiResponse {
      status: 500,
      headers: {
        "Content-Type" => "application/json",
        "Access-Control-Allow-Origin" => "*"
      },
      body: Json.stringify(Json {
        success: false,
        message: "Error loading services"
      })
    };
  }
});

// POST /api/bookings - Create a new booking
api.post("/api/bookings", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  try {
    let body = Json.parse(req.body);
    
    // Validate required fields
    if !body.has("firstName") || !body.has("lastName") || !body.has("email") ||
       !body.has("phone") || !body.has("serviceId") || !body.has("bookingDate") {
      return cloud.ApiResponse {
        status: 400,
        headers: {
          "Content-Type" => "application/json",
          "Access-Control-Allow-Origin" => "*"
        },
        body: Json.stringify(Json {
          success: false,
          message: "Missing required fields"
        })
      };
    }
    
    // Validate serviceId exists
    try {
      let servicesData = servicesBucket.get("services.json");
      let services = Json.parse(servicesData);
      let requestedServiceId = body.get("serviceId").asNum();
      let serviceExists = false;
      for s in services {
        if s.get("id").asNum() == requestedServiceId {
          serviceExists = true;
          break;
        }
      }
      if !serviceExists {
        return cloud.ApiResponse {
          status: 400,
          headers: {
            "Content-Type" => "application/json",
            "Access-Control-Allow-Origin" => "*"
          },
          body: Json.stringify(Json {
            success: false,
            message: "Invalid service ID"
          })
        };
      }
    } catch e {
      return cloud.ApiResponse {
        status: 500,
        headers: {
          "Content-Type" => "application/json",
          "Access-Control-Allow-Origin" => "*"
        },
        body: Json.stringify(Json {
          success: false,
          message: "Unable to validate service ID"
        })
      };
    }
    
    // Generate booking ID
    let bookingId = counter.inc();
    
    // Create booking object
    let booking = Json {
      id: bookingId,
      firstName: body.get("firstName"),
      lastName: body.get("lastName"),
      email: body.get("email"),
      phone: body.get("phone"),
      address: body.get("address") ?? "",
      city: body.get("city") ?? "",
      state: body.get("state") ?? "",
      zipCode: body.get("zipCode") ?? "",
      serviceId: body.get("serviceId"),
      bookingDate: body.get("bookingDate"),
      bookingTime: body.get("bookingTime") ?? "09:00",
      notes: body.get("notes") ?? "",
      status: "pending",
      createdAt: "${new Date().toISOString()}"
    };
    
    // Save booking
    bookingsBucket.put("booking-{bookingId}.json", Json.stringify(booking));
    
    return cloud.ApiResponse {
      status: 201,
      headers: {
        "Content-Type" => "application/json",
        "Access-Control-Allow-Origin" => "*"
      },
      body: Json.stringify(Json {
        success: true,
        bookingId: bookingId,
        message: "Booking created successfully"
      })
    };
  } catch e {
    return cloud.ApiResponse {
      status: 500,
      headers: {
        "Content-Type" => "application/json",
        "Access-Control-Allow-Origin" => "*"
      },
      body: Json.stringify(Json {
        success: false,
        message: "Error creating booking"
      })
    };
  }
});

// GET /api/bookings/:id - Get booking details
api.get("/api/bookings/:id", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  try {
    let bookingId = req.vars.get("id");
    let bookingData = bookingsBucket.get("booking-{bookingId}.json");
    let booking = Json.parse(bookingData);
    
    return cloud.ApiResponse {
      status: 200,
      headers: {
        "Content-Type" => "application/json",
        "Access-Control-Allow-Origin" => "*"
      },
      body: Json.stringify(Json {
        success: true,
        booking: booking
      })
    };
  } catch e {
    return cloud.ApiResponse {
      status: 404,
      headers: {
        "Content-Type" => "application/json",
        "Access-Control-Allow-Origin" => "*"
      },
      body: Json.stringify(Json {
        success: false,
        message: "Booking not found"
      })
    };
  }
});

// GET /confirmation/:id - Get confirmation page data
api.get("/confirmation/:id", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  try {
    let bookingId = req.vars.get("id");
    let bookingData = bookingsBucket.get("booking-{bookingId}.json");
    let booking = Json.parse(bookingData);
    
    // Get service details
    let servicesData = servicesBucket.get("services.json");
    let services = Json.parse(servicesData);
    
    // Find service by ID instead of using array index
    let serviceId = booking.get("serviceId").asNum();
    let service = nil;
    for s in services {
      if s.get("id").asNum() == serviceId {
        service = s;
        break;
      }
    }
    
    // Return error if service not found
    if service == nil {
      return cloud.ApiResponse {
        status: 404,
        headers: {
          "Content-Type" => "application/json",
          "Access-Control-Allow-Origin" => "*"
        },
        body: Json.stringify(Json {
          success: false,
          message: "Service not found for this booking"
        })
      };
    }
    
    return cloud.ApiResponse {
      status: 200,
      headers: {
        "Content-Type" => "application/json",
        "Access-Control-Allow-Origin" => "*"
      },
      body: Json.stringify(Json {
        success: true,
        booking: booking,
        service: service
      })
    };
  } catch e {
    return cloud.ApiResponse {
      status: 404,
      headers: {
        "Content-Type" => "application/json",
        "Access-Control-Allow-Origin" => "*"
      },
      body: Json.stringify(Json {
        success: false,
        message: "Booking not found"
      })
    };
  }
});

// Health check endpoint
api.get("/api/health", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  return cloud.ApiResponse {
    status: 200,
    headers: {
      "Content-Type" => "application/json",
      "Access-Control-Allow-Origin" => "*"
    },
    body: Json.stringify(Json {
      status: "ok",
      service: "Nest and Nurture Cleaning API",
      timestamp: "${new Date().toISOString()}"
    })
  };
});

// Initialize services on startup
new cloud.OnDeploy(inflight () => {
  initServices();
});
