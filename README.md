# Knowledge Board API 📋

A modern, collaborative task management backend built with TypeScript, Express, and PostgreSQL. Think of it as a digital kanban board where teams can organize tasks into columns, add comments, and tag items for better organization.

---

## 🗂️ Database Schema

The Knowledge Board uses a relational PostgreSQL database with 6 core entities. Here's how they fit together:

### **Core Models**

```
User
├── Boards (one-to-many)
└── Comments (one-to-many)

Board
├── Columns (one-to-many)
└── User (many-to-one)

Column
├── Cards (one-to-many)
└── Board (many-to-one)

Card
├── Comments (one-to-many)
├── Tags (many-to-many)
└── Column (many-to-one)

Tag
└── Cards (many-to-many)

Comment
├── Card (many-to-one)
└── User (many-to-one)
```

### **Detailed Model Breakdown**

#### **User** 🧑‍💼
The foundation—represents each person using the system.
- `id` - Unique identifier (UUID)
- `firstName`, `lastName`, `email` - Basic profile info
- `password` - Hashed securely with bcrypt
- `createdAt`, `updatedAt` - Timestamps for tracking

**Key Pattern**: Each user can own multiple boards and leave comments across cards they work on.

#### **Board** 📊
A user's workspace—like a project container where all work happens.
- `id` - Unique identifier (UUID)
- `title` - What this board is for (e.g., "Q1 Goals", "Website Redesign")
- `userId` - Links to the board owner (implicit one-to-many relationship)
- **Cascade Delete**: If a user is deleted, all their boards disappear automatically

**Why this structure**: Keeps everything organized by project/user, making it easy to query "show me all my boards."

#### **Column** 🔄
The lanes in your kanban board—typically represent stages: "To Do", "In Progress", "Done"
- `id` - Unique identifier (UUID)
- `title` - The stage name
- `boardId` - Which board this column belongs to
- **Cascade Delete**: Deleting a board removes all its columns

**Key Pattern**: Columns are the organizational backbone—cards live inside columns.

#### **Card** 🎫
Individual tasks or work items—the actual things people track.
- `id` - Unique identifier (UUID)
- `title` - What needs to be done
- `columnId` - Which column it's currently in
- `dueDate` - Optional deadline (nullable)
- **Indexing**: `columnId` is indexed for fast lookups (critical for performance)
- **Cascade Delete**: Deleting a column removes all its cards

**Relationships**:
- Many cards can have many tags (many-to-many)
- Many comments can belong to one card (one-to-many)

#### **Tag** 🏷️
Reusable labels for categorizing cards across the entire system.
- `id` - Unique identifier (UUID)
- `name` - Tag text (must be unique—you can't have two "Urgent" tags)
- `color` - Hex color code for UI visualization (defaults to black)
- **Many-to-Many with Cards**: A tag can apply to multiple cards, and cards can have multiple tags

**Design Choice**: Tags are system-wide, not per-board. This makes them reusable across all your projects.

#### **Comment** 💬
Discussions and updates on specific cards.
- `id` - Unique identifier (UUID)
- `content` - The comment text
- `cardId` - Which card this comment is on
- `userId` - Who wrote the comment
- **Indexing**: `cardId` is indexed for quick comment retrieval
- **Cascade Delete**: Deleting a card removes its comments (conversations disappear)

**Key Pattern**: Links users and cards, creating a discussion thread on each card.

---

## 🏛️ Architecture & Folder Structure

The codebase follows a **layered architecture pattern** with clear separation of concerns. Here's why this structure wins:

```
src/
├── server.ts              ← Express app setup & route mounting
├── config/
│   ├── env.ts            ← Environment variable validation
│   └── prisma.ts         ← Prisma client singleton
├── routes/               ← API endpoint definitions (HTTP layer)
├── controllers/          ← Request handlers & validation orchestration
├── service/              ← Business logic & database operations
├── middlewares/          ← Cross-cutting concerns (auth, error handling)
├── validators/           ← Input validation schemas (Zod)
└── utils/                ← Helper functions (JWT, password hashing)
```

### **Why This Structure?**

**1. Routes** (`routes/` folder) 🛣️
- **Responsibility**: Define API endpoints and map HTTP verbs to controllers
- **Example**: `/api/boards` → GET, POST routes for boards
- **Why separate**: Routes are configuration files that rarely change business logic

**2. Controllers** (`controllers/` folder) 🎮
- **Responsibility**: Orchestrate requests → validation → service calls → responses
- **Pattern**: Each file handles one resource (cards.controller, boards.controller)
- **Example**:
  ```typescript
  const result = await authService.registerUser(...);
  res.status(201).json({ message: "User registered", data: result });
  ```
- **Why separate**: Controllers stay thin and testable

**3. Services** (`service/` folder) ⚙️
- **Responsibility**: All business logic and database operations
- **Pattern**: Direct Prisma queries with included relationships
- **Example**: `createCard`, `assignTag`, `setDueDate`
- **Why separate**: Database logic separated from HTTP concerns; if you build a CLI later, services stay reusable

**4. Middlewares** (`middlewares/` folder) 🚧
- **Responsibility**: Cross-cutting concerns applied globally or selectively
- **Includes**:
  - `auth.middleware.ts` - JWT verification on protected routes
  - `error.middleware.ts` - Centralized error handling & response formatting
- **Why separate**: Keeps route files clean, applies logic consistently

**5. Validators** (`validators/` folder) ✓
- **Responsibility**: Input validation schemas using Zod
- **Pattern**: Reusable schemas for register, login, board creation, etc.
- **Example**: `registerSchema` validates email format, password strength
- **Why separate**: Validation logic lives in one place; easy to update validation rules

**6. Utils** (`utils/` folder) 🔧
- **Responsibility**: Pure utility functions
- **Includes**:
  - `jwt.util.ts` - Token generation & verification
  - `password.util.ts` - Bcrypt password hashing
- **Why separate**: Reusable cryptographic helpers

**7. Config** (`config/` folder) ⚙️
- **Responsibility**: Singleton instances and environment setup
- **Includes**:
  - `env.ts` - Validates required environment variables on startup
  - `prisma.ts` - Single Prisma client instance exported globally
- **Why separate**: Ensures one Prisma connection, fail-fast env validation

---

## 🔑 Key Engineering Decisions

### **1. Service Layer Pattern**

All database operations live in the `service/` folder. This means:

**✅ Benefits**:
- Controllers stay thin (just validation + response formatting)
- Services are testable (inject Prisma mock for unit tests)
- Business logic is reusable (CLI, webhooks, scheduled jobs can use the same services)

**Example Flow**:
```
HTTP Request → Controller → Validator (Zod) → Service (Prisma) → Database
                                                            ↓
                                            Response with proper status codes
```

### **2. Relationship Handling with Prisma**

The app uses **Prisma's `connect` syntax** for many-to-many relationships like cards and tags:

```typescript
// Assigning multiple tags to a card
await prisma.card.update({
  where: { id: cardId },
  data: {
    tags: {
      connect: tagId.map((id) => ({ id }))  // Connects existing tags
    }
  },
  include: { tags: true }  // Returns card with all its tags
});
```

**Why this approach?**
- **Safe**: Doesn't create duplicate tags; links to existing ones
- **Efficient**: Single database update
- **Explicit**: Easy to understand that tags are being connected, not created

### **3. Cascade Deletes for Data Integrity**

Every foreign key relationship uses `onDelete: Cascade`:

```prisma
model Board {
  userId  String
  user    User @relation(fields: [userId], references: [id], onDelete: Cascade)
  // If a user is deleted, all their boards are automatically deleted
}
```

**Why this decision?**
- **Orphan Prevention**: No cards left hanging when columns are deleted
- **Automatic Cleanup**: Reduces manual garbage collection code
- **Trade-off**: Users can't disable—if you delete a user, their entire workspace vanishes

### **4. Lazy Loading with `include`**

Services use Prisma's `include` to eagerly load related data:

```typescript
const board = await prisma.board.findUnique({
  where: { id: boardId },
  include: {
    columns: {
      include: {
        cards: {
          include: { tags: true }  // Get everything in one query
        }
      }
    }
  }
});
```

**Why nested includes?**
- **Predictable Performance**: Solves N+1 queries in one shot
- **Complete Data**: Client gets full board structure without extra requests
- **Trade-off**: More data across the wire; consider lazy loading for large datasets

### **5. JWT Authentication Pattern**

Tokens are stateless and verified via the `authMiddleware`:

```typescript
// Extract token from Authorization header
const token = authHeader.split(" ")[1];  // "Bearer <token>"

// Verify and decode
const decoded = verifyToken(token);
req.user = decoded;  // Attach userId to request
```

**Why JWT?**
- **Stateless**: No session storage needed
- **Scalable**: Each server can verify tokens independently
- **Standard**: Works with mobile, web, third-party clients

### **6. Zod for Input Validation**

Every endpoint validates input with reusable schemas:

```typescript
const validatedData = registerSchema.parse(req.body);
// If invalid, Zod throws; error middleware catches it
```

**Why Zod?**
- **Type-Safe**: Schemas generate TypeScript types automatically
- **Composable**: Reuse schema parts across validators
- **Clear Errors**: Validation failures have descriptive messages

### **7. Indexed Card & Comment Lookups**

Card and Comment models have indexed `columnId` and `cardId` fields:

```prisma
model Card {
  columnId String
  // @@index([columnId])  // Fast lookups when filtering by column
}
```

**Why index these?**
- **Performance**: Kanban boards constantly query "get all cards in column X"
- **Scalability**: Without indexes, large datasets become slow
- **Trade-off**: Slightly slower writes; acceptable for read-heavy workload

### **8. Optional Due Dates**

Cards have nullable `dueDate` fields:

```typescript
dueDate DateTime?  // Can be null; task doesn't require a deadline
```

**Why optional?**
- **Flexibility**: Not every task has a deadline
- **Simpler UX**: No need to set dummy dates
- **Database**: NULL is efficient for unset values

### **9. Global Error Middleware**

All errors bubble up to the error middleware for consistent responses:

```typescript
return res.status(201).json({ message: "Success", data: result });
// Errors caught by middleware, formatted consistently
```

**Why centralize?**
- **Consistency**: All 400/500 errors have the same shape
- **Logging**: One place to log errors
- **Security**: Prevents accidental stack trace leakage in production

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Environment variables: `JWT_SECRET`, `DATABASE_URL`, `PORT` (optional)

### Installation
```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Start development server
npm run dev
```

### Database URL Format
```
postgresql://username:password@localhost:5432/knowledge_board
```

---

## 📡 API Structure

Routes are organized hierarchically:

```
/api/auth              → Authentication (register, login)
/api/users             → User profiles
/api/boards            → Create/read/update/delete boards
/api/boards/:id/columns → Columns within a board
/api/columns/:id/cards → Cards within a column
/api/cards/:id/comments → Comments on a card
/api/tags              → Global tag management
```

**Authentication**: Bearer token required for all routes except `/api/auth/*`

---

## 💪 The Reasoning Behind Together

This architecture was built to be:

- **Maintainable**: Clear layering means developers know where code lives
- **Testable**: Service layer makes unit tests straightforward
- **Scalable**: Indexed queries and lazy loading handle growth
- **Secure**: Bcrypt passwords, JWT tokens, cascade deletes prevent orphans
- **Consistent**: Zod validation, centralized error handling, reusable patterns

The database schema reflects real kanban workflows: users own boards, boards contain columns, columns contain cards, cards have tags and comments. Relationships are explicit and enforced at the database level.

---

## 📝 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Security**: bcrypt (passwords), JWT (tokens)
- **Development**: tsx, nodemon for hot reload

---

**Happy building! 🎉**