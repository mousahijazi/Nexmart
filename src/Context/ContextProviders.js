import ProductProvider from "./CartProvider";
import AlertProvider from "./AlertProvider";
import UserProvider from "./UserProvider";

export default function ContextProviders({children}) {
  return (
    <AlertProvider>
      <UserProvider>
        <ProductProvider>
          {children}
        </ProductProvider>
      </UserProvider>
    </AlertProvider>
  )
}
