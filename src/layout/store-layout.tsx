import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "./navbar";
import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface Product {
  id: number;
  name: string;
  price: number;
  priceUSD: number; // Precio en dólares para PayPal
  image: string;
  borderImage: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Mirador",
    price: 15, // Precio en puntos
    priceUSD: 1.99, // Precio en USD
    image: "/src/assets/images/sin-bordes.png",
    borderImage: "/src/assets/images/borde-mirador.png"
  },
  {
    id: 2,
    name: "Rotación",
    price: 25,
    priceUSD: 2.99,
    image: "/src/assets/images/marco.png",
    borderImage: "/src/assets/images/borde-rotacion.png"
  },
  {
    id: 3,
    name: "Estampa",
    price: 50,
    priceUSD: 4.99,
    image: "/src/assets/images/borde-para-cuadros-de-marco.png",
    borderImage: "/src/assets/images/borde-estampa.png"
  },
];

export default function StoreLayout() {
  const [points, setPoints] = useState(0);
  const [ownedBorders, setOwnedBorders] = useState<number[]>([]);
  const [selectedBorder, setSelectedBorder] = useState<string | null>(null);
  /* const [activeProduct, setActiveProduct] = useState<Product | null>(null); */
  const [paypalReady, setPaypalReady] = useState(false);

  useEffect(() => {
    const savedPoints = localStorage.getItem('points');
    const savedBorders = localStorage.getItem('ownedBorders');
    const savedSelectedBorder = localStorage.getItem('selectedBorder');

    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedBorders) setOwnedBorders(JSON.parse(savedBorders));
    if (savedSelectedBorder) setSelectedBorder(savedSelectedBorder);

    // Simular carga de PayPal
    const timer = setTimeout(() => setPaypalReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const purchaseWithPoints = (productId: number, productPrice: number) => {
    if (points >= productPrice) {
      const newPoints = points - productPrice;
      setPoints(newPoints);

      const newOwnedBorders = [...ownedBorders, productId];
      setOwnedBorders(newOwnedBorders);

      localStorage.setItem('points', newPoints.toString());
      localStorage.setItem('ownedBorders', JSON.stringify(newOwnedBorders));

      alert(`¡Has comprado el borde con tus puntos!`);
    } else {
      alert("No tienes suficientes puntos para comprar este borde");
    }
  };

  const selectBorder = (borderImage: string) => {
    setSelectedBorder(borderImage);
    localStorage.setItem('selectedBorder', borderImage);
  };

  const handlePaypalSuccess = (product: Product) => {
    const newOwnedBorders = [...ownedBorders, product.id];
    setOwnedBorders(newOwnedBorders);
    localStorage.setItem('ownedBorders', JSON.stringify(newOwnedBorders));
    alert(`¡Compra exitosa! El borde ${product.name} es tuyo.`);
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: "AfNbVQz2vHDhS-rSvyt2gOUJ5GZ3M11lY4PshkPxQBCEVRE1ZDCDoThapczh8GGCGhcJLzl_l9R6bXgm",
        currency: "USD",
        intent: "capture",
        components: "buttons",
      }}
    >
      <div className="h-screen">
        <Navbar points={points} selectedBorder={selectedBorder} />

        <div className="min-h-screen bg-white text-black p-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Tienda de Bordes</h1>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full">
              Puntos: {points}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-gray-100 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg" />
                    {selectedBorder === product.borderImage && (
                      <div className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none"></div>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-center">{product.name}</h2>

                  <div className="flex gap-4 my-2">
                    <p className="text-lg font-bold text-green-600">{product.price} puntos</p>
                    <p className="text-lg font-bold text-blue-600">${product.priceUSD} USD</p>
                  </div>

                  <div className="mt-2 flex flex-col gap-2 w-full">
                    {ownedBorders.includes(product.id) ? (
                      selectedBorder === product.borderImage ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Seleccionado
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => selectBorder(product.borderImage)}
                        >
                          Usar este borde
                        </Button>
                      )
                    ) : (
                      <>
                        <Button
                          className="w-full bg-gray-800 hover:bg-gray-900"
                          onClick={() => purchaseWithPoints(product.id, product.price)}
                          disabled={points < product.price}
                        >
                          Comprar con puntos
                        </Button>

                        <div className="w-full">
                          {paypalReady && (
                            <PayPalButtons
                              style={{ layout: "horizontal" }}
                              createOrder={(_data, actions) => {
                                return actions.order.create({
                                  purchase_units: [
                                    {
                                      description: `Borde ${product.name}`,
                                      amount: {
                                        value: product.priceUSD.toString(),
                                        currency_code: "USD",
                                        breakdown: {
                                          item_total: {
                                            value: product.priceUSD.toString(),
                                            currency_code: "USD"
                                          }
                                        }
                                      },
                                      items: [
                                        {
                                          name: `Borde ${product.name}`,
                                          unit_amount: {
                                            value: product.priceUSD.toString(),
                                            currency_code: "USD"
                                          },
                                          quantity: "1",
                                          category: "DIGITAL_GOODS"
                                        }
                                      ]
                                    }
                                  ],
                                  application_context: {
                                    shipping_preference: "NO_SHIPPING",
                                    user_action: "PAY_NOW"
                                  },
                                  intent: "CAPTURE"
                                });
                              }}
                              onApprove={async (_data, actions) => {
                                try {
                                  const details = await actions.order?.capture();
                                  console.log("Detalles de la transacción:", details);
                                  handlePaypalSuccess(product);
                                  // No return value needed, must return void
                                } catch (err) {
                                  console.error("Error al capturar el pago:", err);
                                  alert("Ocurrió un error al procesar tu pago");
                                }
                              }}
                              onError={(err) => {
                                console.error("Error en PayPal:", err);
                                alert("Error al procesar el pago con PayPal");
                              }}
                              onCancel={() => {
                                console.log("El usuario canceló el pago");
                              }}
                            />)}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}