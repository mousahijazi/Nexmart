import ProductProvider from "./CartProvider";
import AlertProvider from "./AlertProvider";
import UserProvider from "./UserProvider";
import ThemeProvider from "./ThemeProvider";
import WishlistProvider from "./WishlistProvider";
import CheckoutProvider from "./CheckoutProvider";
import ReviewProvider from "./ReviewProvider";
import OrdersProvider from "./OrdersContext";

export default function ContextProviders({ children, initialUser }) {
  return (
    <ThemeProvider>
      <AlertProvider>
        <UserProvider initialUser={initialUser}>
            <ReviewProvider>
              <CheckoutProvider>
                <OrdersProvider>
                  <ProductProvider>
                    <WishlistProvider>
                      {children}
                    </WishlistProvider>
                  </ProductProvider>
                </OrdersProvider>
              </CheckoutProvider>
            </ReviewProvider>
        </UserProvider>
      </AlertProvider>
    </ThemeProvider>
  )
}
