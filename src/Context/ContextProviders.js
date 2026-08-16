import ProductProvider from "./CartProvider";
import AlertProvider from "./AlertProvider";
import UserProvider from "./UserProvider";
import ThemeProvider from "./ThemeProvider";
import WishlistProvider from "./WishlistProvider";
import CheckoutProvider from "./CheckoutProvider";

export default function ContextProviders({children}) {
  return (
    <ThemeProvider>
      <AlertProvider>
        <CheckoutProvider>
          <UserProvider>
            <ProductProvider>
              <WishlistProvider>
                {children}
              </WishlistProvider>
            </ProductProvider>
          </UserProvider>
        </CheckoutProvider>
      </AlertProvider>
    </ThemeProvider>
  )
}
