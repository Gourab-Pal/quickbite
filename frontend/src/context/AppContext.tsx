import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { addresses as initialAddresses, offers } from '../data'
import type {
  Address,
  CartLine,
  MenuItem,
  Offer,
  OverlayState,
  OverlayType,
  Restaurant,
} from '../types'

type PendingCartItem = {
  item: MenuItem
  restaurant: Restaurant
  option?: string
}

type AppContextValue = {
  overlay: OverlayState
  openOverlay: (type: OverlayType, payload?: unknown) => void
  closeOverlay: () => void

  cart: CartLine[]
  cartRestaurant: Restaurant | null
  cartCount: number
  cartSubtotal: number

  addItem: (
    item: MenuItem,
    restaurant: Restaurant,
    option?: string,
  ) => void

  updateQuantity: (itemId: string, delta: number) => void
  clearCart: () => void
  confirmCartReplacement: () => void

  user: {
    name: string
    phone: string
  } | null

  signIn: (phone: string) => void
  signOut: () => void

  addresses: Address[]
  selectedAddress: Address | null
  selectAddress: (address: Address) => void
  saveAddress: (address: Address) => void
  deleteAddress: (id: string) => void

  selectedLocation: string
  setSelectedLocation: (location: string) => void

  appliedOffer: Offer | null
  applyOffer: (offer: Offer) => void

  paymentMethod: string
  setPaymentMethod: (method: string) => void

  toast: string
  showToast: (message: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({
  children,
}: {
  children: ReactNode
}) {
  const [overlay, setOverlay] = useState<OverlayState>(null)

  const [cart, setCart] = useState<CartLine[]>([])

  const [cartRestaurant, setCartRestaurant] =
    useState<Restaurant | null>(null)

  const [pendingItem, setPendingItem] =
    useState<PendingCartItem | null>(null)

  const [user, setUser] = useState<{
    name: string
    phone: string
  } | null>(null)

  const [addresses, setAddresses] =
    useState<Address[]>(initialAddresses)

  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(initialAddresses[0])

  const [selectedLocation, setSelectedLocation] =
    useState('Koramangala, Bengaluru')

  const [appliedOffer, setAppliedOffer] =
    useState<Offer | null>(offers[0])

  const [paymentMethod, setPaymentMethod] =
    useState('UPI · gourab@okaxis')

  const [toast, setToast] = useState('')

  const openOverlay = useCallback(
    (type: OverlayType, payload?: unknown) => {
      setOverlay({
        type,
        payload,
      })
    },
    [],
  )

  const closeOverlay = useCallback(() => {
    setOverlay(null)
  }, [])

  const showToast = useCallback((message: string) => {
    setToast(message)

    window.setTimeout(() => {
      setToast('')
    }, 2600)
  }, [])

  const addDirectly = useCallback(
    (
      item: MenuItem,
      restaurant: Restaurant,
      option?: string,
    ) => {
      setCartRestaurant(restaurant)

      setCart((currentCart) => {
        const existingItem = currentCart.find(
          (line) =>
            line.id === item.id &&
            line.option === option,
        )

        if (existingItem) {
          return currentCart.map((line) => {
            const isSameItem =
              line.id === item.id &&
              line.option === option

            if (isSameItem) {
              return {
                ...line,
                quantity: line.quantity + 1,
              }
            }

            return line
          })
        }

        return [
          ...currentCart,
          {
            ...item,
            quantity: 1,
            option,
          },
        ]
      })

      showToast(`${item.name} added to cart`)
    },
    [showToast],
  )

  const addItem = useCallback(
    (
      item: MenuItem,
      restaurant: Restaurant,
      option?: string,
    ) => {
      if (item.soldOut) {
        showToast('This item is currently sold out')
        return
      }

      const cartHasAnotherRestaurant =
        cartRestaurant &&
        cartRestaurant.id !== restaurant.id &&
        cart.length > 0

      if (cartHasAnotherRestaurant) {
        setPendingItem({
          item,
          restaurant,
          option,
        })

        setOverlay({
          type: 'replace-cart',
        })

        return
      }

      addDirectly(item, restaurant, option)
    },
    [
      addDirectly,
      cart.length,
      cartRestaurant,
      showToast,
    ],
  )

  const confirmCartReplacement = useCallback(() => {
    if (!pendingItem) {
      return
    }

    setCart([])
    setCartRestaurant(null)

    addDirectly(
      pendingItem.item,
      pendingItem.restaurant,
      pendingItem.option,
    )

    setPendingItem(null)
    setOverlay(null)
  }, [addDirectly, pendingItem])

  const updateQuantity = useCallback(
    (itemId: string, delta: number) => {
      setCart((currentCart) => {
        const updatedCart = currentCart.map((line) => {
          if (line.id === itemId) {
            return {
              ...line,
              quantity: line.quantity + delta,
            }
          }

          return line
        })

        const nonEmptyItems = updatedCart.filter(
          (line) => line.quantity > 0,
        )

        if (nonEmptyItems.length === 0) {
          setCartRestaurant(null)
        }

        return nonEmptyItems
      })
    },
    [],
  )

  const clearCart = useCallback(() => {
    setCart([])
    setCartRestaurant(null)
    setAppliedOffer(null)
  }, [])

  const saveAddress = useCallback(
    (address: Address) => {
      setAddresses((currentAddresses) => {
        const addressAlreadyExists =
          currentAddresses.some(
            (entry) => entry.id === address.id,
          )

        if (addressAlreadyExists) {
          return currentAddresses.map((entry) => {
            if (entry.id === address.id) {
              return address
            }

            return entry
          })
        }

        return [...currentAddresses, address]
      })

      setSelectedAddress(address)
      setOverlay(null)
      showToast('Address saved')
    },
    [showToast],
  )

  const deleteAddress = useCallback(
    (id: string) => {
      setAddresses((currentAddresses) =>
        currentAddresses.filter(
          (address) => address.id !== id,
        ),
      )

      setSelectedAddress((currentAddress) => {
        if (currentAddress?.id === id) {
          return null
        }

        return currentAddress
      })

      showToast('Address removed')
    },
    [showToast],
  )

  const cartCount = cart.reduce(
    (count, line) => count + line.quantity,
    0,
  )

  const cartSubtotal = cart.reduce(
    (sum, line) =>
      sum + line.price * line.quantity,
    0,
  )

  const value = useMemo<AppContextValue>(
    () => ({
      overlay,
      openOverlay,
      closeOverlay,

      cart,
      cartRestaurant,
      cartCount,
      cartSubtotal,

      addItem,
      updateQuantity,
      clearCart,
      confirmCartReplacement,

      user,

      signIn: (phone) => {
        setUser({
          name: 'Gourab',
          phone,
        })

        setOverlay(null)
        showToast('Welcome to QuickBite')
      },

      signOut: () => {
        setUser(null)
        showToast('Signed out successfully')
      },

      addresses,
      selectedAddress,
      selectAddress: setSelectedAddress,
      saveAddress,
      deleteAddress,

      selectedLocation,
      setSelectedLocation,

      appliedOffer,

      applyOffer: (offer) => {
        setAppliedOffer(offer)
        setOverlay(null)
        showToast(`${offer.code} applied`)
      },

      paymentMethod,
      setPaymentMethod,

      toast,
      showToast,
    }),
    [
      addItem,
      addresses,
      appliedOffer,
      cart,
      cartCount,
      cartRestaurant,
      cartSubtotal,
      clearCart,
      closeOverlay,
      confirmCartReplacement,
      deleteAddress,
      openOverlay,
      overlay,
      paymentMethod,
      saveAddress,
      selectedAddress,
      selectedLocation,
      showToast,
      toast,
      updateQuantity,
      user,
    ],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error(
      'useApp must be used inside AppProvider',
    )
  }

  return context
}