# Canvas Interaction Guide (v1.0 - 2026-01-04)

This document details the functionality, keyboard shortcuts, and logic for the Shared Canvas component as of January 4, 2026.

## 1. Canvas Layers & Z-Index
The component uses three stacked HTML5 Canvases to manage independent drawing layers.

| Layer Name | Z-Index | Description |
| :--- | :--- | :--- |
| **Temp Layer** | `30` | **Auxiliary drawings** (Mentor Only). Automatically cleared when switching to Main Pen. |
| **Teacher Layer** | `20` | **Mentor's main drawings**. Always visible. |
| **Student Layer** | `10` | **Student's drawings**. Always visible, rendered below teacher. |
| **Content** | `0` | Problem text and images (DOM). |

## 2. Background Styles
*   **Mentor**: Dark Green (`#1b5e20`) with **Grid Pattern** (White, 10% opacity, 20px).
*   **Student**: Dark Green (`#1b5e20`) **Solid** (No Grid).

## 3. Keyboard Shortcuts

### 3.1 Mode Switching (Mentor)
Switching modes automatically sets the active layer, default color, and resets line width to default (1x).

| Shortcut | Mode | Layer | Default Color | Special Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Shift + s** | **Main Pen** | Teacher | **White** | **Clears Temp Layer** on activation. Resets width. |
| **Shift + r** | **Sub Pen** | Teacher | **Red** | Switches to Teacher layer. Resets width. |
| **Shift + y** | **Aux Pen** | Temp | **Green** | Switches to Temp layer. Resets width. |
| **Shift + e** | - | - | - | **Clears Teacher Layer**. |

### 3.2 Eraser Modes (Mentor & Student)
Eraser uses `destination-out` composition to remove strokes. Resets line width to default.

| Shortcut | User | Target Layer | Description |
| :--- | :--- | :--- | :--- |
| **Shift + q** | **Everyone** | **Self** | Erases own layer (Mentor -> Teacher, Student -> Student). |
| **Shift + t** | **Mentor Only** | **Student** | **Erases Student Layer**. |

### 3.3 Color Shortcuts
Changes the *current* pen color immediately without changing layer or mode.

*   **Shift + 1**: Black
*   **Shift + 2**: Red
*   **Shift + 3**: Blue
*   **Shift + 4**: Yellow
*   **Shift + 5**: Pink
*   **Shift + 6**: Orange

### 3.4 Line Width Controls
Dynamically scales the line width for the *active* tool (Pen or Eraser).
*   **Shift + +** (Plus/Equal): **Doubles** width (x2).
*   **Shift + -** (Minus): **Halves** width (/2).
*   **Note**: Switching tools (e.g., pressing Shift+s) **Resets** width to default (x1).

## 4. Synchronization Logic

### 4.1 Color Translation
To distinguish users, the "Main Pen" (White) is translated remotely.
*   **Local View**: User sees their own Main Pen as **White**.
*   **Remote View**: Other user sees it as **Bright Blue** (`#00B0FF`).
*   *Other Colors*: Red, Green, etc. are seen exactly as drawn.

### 4.2 Eraser Sync
*   Eraser state (`isEraser: true`) is sent via socket.
*   Remote client applies `destination-out` to replicate erasing.

### 4.3 Line Width Sync
*   Calculated line width is sent via socket.
*   Remote client draws with the exact same thickness.

### 4.4 Anti-Flickering
*   Client ignores socket events originating from its own `socket.id`.
*   This prevents the "Remote Blue" echo from overwriting local "White" strokes.
