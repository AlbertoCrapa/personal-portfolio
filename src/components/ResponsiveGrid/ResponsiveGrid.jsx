import React from "react";

const ResponsiveGrid = ({ children }) => (
  <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {children}
  </div>
);

export default ResponsiveGrid;
