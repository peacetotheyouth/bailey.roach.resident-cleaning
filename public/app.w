bring cloud;

// Define cloud resources for resident cleaning task management
let api = new cloud.Api();
let database = new cloud.Bucket() as "cleaning-tasks-db";
let counter = new cloud.Counter() as "task-id-counter";

// GET /api/tasks - Retrieve all cleaning tasks
api.get("/api/tasks", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  let tasks = MutArray<Json>[];

  // Load tasks from the bucket: list all objects and select those matching task-*.json
  let objects = database.list();
  for key in objects {
    if key.startsWith("task-") && key.endsWith(".json") {
      let content = database.get(key);
      let parsed = Json.tryParse(content);
      if parsed != nil {
        tasks.push(parsed!);
      }
    }
  }
  return {
    status: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    },
    body: Json.stringify(tasks)
  };
});

// POST /api/tasks - Create a new cleaning task
api.post("/api/tasks", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  let taskData = Json.tryParse(req.body ?? "");

  // Validate JSON body
  if taskData == nil {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: Json.stringify({ error: "Invalid JSON in request body" })
    };
  }

  // Validate required fields
  let title = taskData?.tryGet("title");
  let description = taskData?.tryGet("description");
  let assignedTo = taskData?.tryGet("assignedTo");
  let dueDate = taskData?.tryGet("dueDate");

  if title == nil || description == nil || assignedTo == nil || dueDate == nil {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: Json.stringify({ error: "Missing required fields: title, description, assignedTo, dueDate" })
    };
  }

  let nextId = counter.inc();
  let taskId = "${nextId}";
  
  let newTask = {
    id: taskId,
    title: title,
    description: description,
    assignedTo: assignedTo,
    dueDate: dueDate,
    status: "pending"
  };
  
  // Store task in cloud bucket
  database.put("task-${nextId}.json", Json.stringify(newTask));
  
  return {
    status: 201,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    },
    body: Json.stringify(newTask)
  };
});

// PUT /api/tasks/:id - Update task status
api.put("/api/tasks/:id", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  let taskId = req.vars.get("id");
  let updateData = Json.tryParse(req.body ?? "");

  // Validate request body JSON
  if updateData == nil {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: Json.stringify({ error: "Invalid request body JSON" })
    };
  }
  
  // Retrieve existing task
  let taskKey = "task-${taskId}.json";
  
  try {
    let existingTaskData = database.get(taskKey);
    let parsedTask = Json.tryParse(existingTaskData);

    if parsedTask == nil {
      return {
        status: 500,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        body: Json.stringify({ error: "Stored task data is corrupted" })
      };
    }

    let task = parsedTask!;
    
    // Update status if provided, with validation
    if let updatedStatus = updateData?.tryGet("status") {
      if !(updatedStatus == "pending" || updatedStatus == "in-progress" || updatedStatus == "completed") {
        return {
          status: 400,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          body: Json.stringify({ error: "Invalid status value" })
        };
      }
      task.set("status", updatedStatus);
    }
    
    // Save updated task
    database.put(taskKey, Json.stringify(task));
    
    return {
      status: 200,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: Json.stringify(task)
    };
  } catch {
    return {
      status: 404,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: Json.stringify({ error: "Task not found" })
    };
  }
});

// GET /api/services - Get available cleaning services
api.get("/api/services", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  let services = [
    {
      id: "1",
      name: "Standard Cleaning",
      description: "Regular cleaning of common areas and assigned rooms",
      duration: "2 hours"
    },
    {
      id: "2",
      name: "Deep Cleaning",
      description: "Thorough cleaning including hard-to-reach areas",
      duration: "4 hours"
    },
    {
      id: "3",
      name: "Move-Out Cleaning",
      description: "Complete cleaning for move-out preparation",
      duration: "6 hours"
    }
  ];
  
  return {
    status: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    },
    body: Json.stringify(services)
  };
});

// POST /api/bookings - Create a cleaning service booking
api.post("/api/bookings", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  // Parse and validate request body
  let parsedBody = Json.tryParse(req.body ?? "");

  if let bookingData = parsedBody {
    let serviceId = bookingData.get("serviceId");
    let residentName = bookingData.get("residentName");
    let date = bookingData.get("date");
    let time = bookingData.get("time");

    if serviceId == nil || residentName == nil || date == nil || time == nil {
      return {
        status: 400,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        body: Json.stringify({
          error: "Missing required fields",
          requiredFields: ["serviceId", "residentName", "date", "time"]
        })
      };
    }

    let nextId = counter.inc();
    let bookingId = "${nextId}";

    let newBooking = {
      id: bookingId,
      serviceId: serviceId,
      residentName: residentName,
      date: date,
      time: time,
      status: "confirmed"
    };

    // Store booking in cloud bucket
    database.put("booking-${nextId}.json", Json.stringify(newBooking));

    return {
      status: 201,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: Json.stringify(newBooking)
    };
  } else {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: Json.stringify({
        error: "Invalid JSON in request body"
      })
    };
  }
});

// GET /api/bookings - Retrieve all bookings
api.get("/api/bookings", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  let bookings = MutArray<Json>[];
  
  // List all booking files from database
  let files = database.list("booking-");
  
  for file in files {
    let bookingData = database.get(file);
    let booking = Json.tryParse(bookingData);
    if let b = booking {
      bookings.push(b);
    }
  }
  
  return {
    status: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    },
    body: Json.stringify(bookings)
  };
});

// Health check endpoint
api.get("/health", inflight (req: cloud.ApiRequest): cloud.ApiResponse => {
  return {
    status: 200,
    headers: {
      "content-type": "application/json"
    },
    body: Json.stringify({ status: "healthy", service: "Resident Cleaning API" })
  };
});
