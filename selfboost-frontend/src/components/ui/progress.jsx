import React from "react"

const Progress = React.forwardRef(({ className, value, indicatorColor, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`}
    {...props}
  >
    <div
      className="h-full w-full flex-1 transition-all"
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
        backgroundColor: indicatorColor 
      }}
    />
  </div>
))

Progress.displayName = "Progress"

export { Progress }