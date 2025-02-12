@@ const handleMouseUp = async () => {
-    // Save selection box as percentages of window size
-    const relativeBox = {
-        startX: (selectionBox.startX / videoRef.current.videoWidth) * 100,
-        startY: (selectionBox.startY / videoRef.current.videoHeight) * 100,
-        endX: (selectionBox.endX / videoRef.current.videoWidth) * 100,
-        endY: (selectionBox.endY / videoRef.current.videoHeight) * 100
-    };
+    // Compute selection width and height
+    const width = Math.abs(selectionBox.endX - selectionBox.startX);
+    const height = Math.abs(selectionBox.endY - selectionBox.startY);
+    if (width <= 0 || height <= 0) {
+         console.error('Invalid selection box dimensions:', width, height);
+         showBannerMessage('Invalid selection. Please adjust the capture area.', false);
+         return;
+    }
+
+    // Save selection box as percentages of window size
+    const relativeBox = {
+        startX: (selectionBox.startX / videoRef.current.videoWidth) * 100,
+        startY: (selectionBox.startY / videoRef.current.videoHeight) * 100,
+        endX: (selectionBox.endX / videoRef.current.videoWidth) * 100,
+        endY: (selectionBox.endY / videoRef.current.videoHeight) * 100
+    };
} 