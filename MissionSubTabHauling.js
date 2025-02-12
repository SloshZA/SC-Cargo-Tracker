@@ In the Manifest View (rendering the table rows)
-                                        <td className="pickup">{entry.pickupPoint}</td>
+                                        <td className="pickup">{entry.pickup || entry.pickupPoint}</td> 
@@ In the Manifest View table header:
-    <th className="manifest-pickup">Pickup</th>
+    <th className="pickup">Pickup</th>
@@ In the Manifest View table rows:
-    <td className="pickup">{entry.pickup || entry.pickupPoint}</td>
+    <td className="pickup">{entry.pickup}</td> 