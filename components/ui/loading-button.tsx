import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface LoadingButtonProps extends Omit<ButtonProps, "children"> {
  isLoading?: boolean
  text: string
  loadingText?: string
  icon?: React.ReactNode
  loadingIcon?: React.ReactNode
  children?: React.ReactNode
}

const LoadingButton = ({
  isLoading,
  text,
  loadingText,
  icon,
  loadingIcon = <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
  disabled,
  className,
  children,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      disabled={disabled || isLoading}
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {isLoading ? (
        <>
          {loadingIcon}
          {loadingText || text}
        </>
      ) : (
        <>
          {icon}
          {text}
        </>
      )}
      {children}
    </Button>
  )
}

export default LoadingButton 