# System Architecture Document (SAD) - ElcueMath

## 1. Executive Summary
ElcueMath is a real-time interactive mathematics tutoring platform connecting Mentors (Teachers) and Mentees (Students). The system is currently undergoing a phased migration from a legacy **Pug/jQuery** monolith to a modern **React (SPA)** architecture, while maintaining backward compatibility with the existing **Node.js/Express** backend and **MySQL** database.

## 2. High-Level Architecture

The system follows a **Hybrid MERN Stack** architecture:
-   **Frontend**: React (Vite) running alongside Legacy Pug templates.
-   **Backend**: Node.js (Express) serving both API endpoints and Legacy Views.
-   **Database**: MySQL (Sequelize ORM).
-   **Real-time**: Socket.IO (Signaling & Canvas Sync) + WebRTC (Video/Audio).

```mermaid
graph TD
    User[User (Mentor/Student)]
    
    subgraph Frontend [Hybrid Frontend]
        React[React SPA (Vite)]
        LegacyClient[Legacy Pug/jQuery]
        PopOut[Mentor Call Window (React)]
    end
    
    subgraph Backend [Node.js Server]
        Express[Express App]
        SocketIO[Socket.IO Server]
        MigrationAPI[Migration API Router]
        LegacyRoutes[Legacy Routes]
    end
    
    subgraph Database
        MySQL[(MySQL DB)]
    end
    
    User --> React
    User --> LegacyClient
    
    React -- API / REST --> MigrationAPI
    React -- WebSocket --> SocketIO
    React -- WebRTC (P2P) --> User
    
    MigrationAPI --> CMS_Service
    CMS_Service --> MySQL
    
    SocketIO -- Signaling --> React
```

## 3. Core Subsystems

### 3.1 Frontend (React Migration)
The new frontend is built with **React**, **Vite**, and **Tailwind CSS**. It progressively replaces legacy pages.

*   **Entry Point**: `frontend/src/main.jsx` (mounted via `index.html` or proxied through Legacy views).
*   **Key Pages**:
    *   `MentorCenter.jsx`: Main teaching dashboard. Features **Session Control** (CMS Tree), **SharedCanvas**, and Student Management.
    *   `StudentCenter.jsx`: Student learning interface. Features **SharedCanvas** and Auto-accept Video Call.
    *   `MentorCallWindow.jsx`: Dedicated pop-out window for WebRTC calls, keeping video separate from the instructional canvas.
*   **Components**:
    *   `SharedCanvas.jsx`: A reusable canvas component using the HTML5 Canvas API and Socket.IO for real-time stroke synchronization. Supports MathJax for inline rendering.

### 3.2 Real-time Infrastructure
Real-time features are powered by **Socket.IO** with varying namespaces.

| Namespace | Purpose | Key Events |
| :--- | :--- | :--- |
| `/draw` | **Main Communication Channel**. Handles Canvas drawing, WebRTC Signaling, and Call Control. | `canvpos` (draw), `call_request`, `webrtc_signal`, `end_call`, `joinRoom` |
| `/vdrg` | **Legacy Presence**. Maintains backward compatibility with legacy mentor/student connection logic. | `vdrgsocketidregister` |

### 3.3 WebRTC (Video/Audio)
Direct P2P communication for video/audio tutoring.

*   **Architecture**: Mesh (1:1 P2P).
*   **Signaling**: Transported via the `/draw` Socket.IO namespace.
*   **Flow**:
    1.  Mentor clicks "Connect" -> Opens `MentorCallWindow`.
    2.  Mentor selects Audio/Video -> Emits `call_request` w/ `offer`.
    3.  Student (Auto-accept) -> Emits `answer`.
    4.  ICE Candidates exchanged via `webrtc_signal`.
    5.  P2P Stream established.
*   **Correction**: Backticks used in legacy DB content are stripped before rendering.

### 3.4 Content Management System (CMS)
A hierarchical problem database organized as **R3 (Curriculum) -> R2 (Unit) -> R1 (Concept) -> Problems**.

*   **Backend Service**: `cmsService.js` (Sequelize queries).
*   **Frontend**:
    *   **Session Control**: A side-panel in `MentorCenter` to browse the CMS tree.
    *   **Problem Fetching**: On-demand fetching via `/api/migration/mentor/problems?r1_id=...`.
    *   **Rendering**: MathJax is used to render LaTeX-style math content in problems. Specifically configured to support inline `\( ... \)` and block `\[ ... \]` syntax.

## 4. Workflows

### 4.1 Class Session Workflow
1.  **Login**: User authenticates via Legacy Passport.js logic.
2.  **Initialization**:
    *   Frontend calls `/api/migration/mentor/init-data`.
    *   Loads CMS Tree and Assigned Students.
    *   Joins Socket.IO rooms (`/draw` room = Student Username).
3.  **Teaching**:
    *   Mentor selects a Concept (R1) from Session Control.
    *   Mentor clicks a Problem -> Problem Image/Text sent to Canvas via Socket.
    *   Mentor/Student draw on Canvas -> Strokes synced in real-time.
4.  **Tutoring Call**:
    *   Mentor launches Call Window.
    *   Student automatically accepts.
    *   Video/Audio enables real-time guidance.

## 5. Directory Structure
```
root/
├── backend/            # Server-side logic
│   ├── models/         # Sequelize Models
│   ├── service/        # Business Logic (CMS)
│   └── ...
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # SharedCanvas, etc.
│   │   ├── pages/      # MentorCenter, StudentCenter
│   │   └── ...
│   └── vite.config.js
├── routes/             # Express Routes
│   ├── migration_api.js # New API for React
│   └── ...
└── cdctapp.js          # Main Application Entry Point
```

## 6. Future Roadmap
*   **Full Migration**: Replace all remaining Pug views with React pages.
*   **Session Recording**: Implement media server (SFU) for recording sessions.
*   **Mobile Support**: Responsive design for tablet/mobile interfaces.
