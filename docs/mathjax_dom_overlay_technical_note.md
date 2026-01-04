# Technical Note: MathJax & HTML Layout Integration

## Problem Summary
When integrating MathJax rendering into a shared canvas, we encountered a conflict between standard HTML line breaks (`<br>` tags) and the rendering mechanism.

### Root Causes
1.  **SVG/XML Strictness**: Initial attempts to convert HTML content (including MathJax) to an image using SVG `foreignObject` failed because `<br>` tags (without closing slashes) are invalid XML. This caused the entire render to fail or display artifacts.
2.  **Layout Collapse**: MathJax typeset operations modify the DOM, often inserting elements with specific inline styles. When mixed with raw HTML in a non-block container, browsers would sometimes collapse the layout, ignoring `<br>` tags or treating the text as a single run.

## Solution: DOM Overlay Architecture

Instead of converting content to an image, we adopted a layered architecture:

-   **Layer 1 (Background)**: A standard HTML `div` positioned absolutely behind the canvas. This container holds the actual rendered HTML and MathJax content.
-   **Layer 2 (Foreground)**: A transparent `<canvas>` element for drawing operations.

### Critical Implementation Details

To ensure proper rendering of both MathJax equations and HTML formatting (specifically `<br>` tags), the background container requires specific CSS properties:

```jsx
<div
    // 1. Text alignment ensures standard flow start
    className="... text-left" 
>
    {/* 2. Explicit 'w-full' and 'block' force the browser to treat this 
           as a block-level context, respecting <br> tags regardless 
           of MathJax's inline DOM manipulations */}
    <div 
        className="w-full block" 
        dangerouslySetInnerHTML={{ __html: problemContent.text }} 
    />
</div>
```

### Outcome
This approach allows:
-   **Native Rendering**: Browsers handle font rendering and line breaks naturally.
-   **Robustness**: No dependency on fragile XML parsing of user-generated HTML.
-   **Interaction**: Drawing works seamlessly on top of the content.
