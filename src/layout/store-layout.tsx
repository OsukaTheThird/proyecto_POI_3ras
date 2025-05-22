import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "./navbar"


const products = [
  {
    id: 1,
    name: "Ballenas estelares",
    price: 79,
    image: "src/assets/images/sin-bordes.png",
  },
  {
    id: 2,
    name: "Vivir en las nubes",
    price: 79,
    image: "src/assets/images/marco.png",
  },
  {
    id: 3,
    name: "Espejismo",
    price: 79,
    image: "src/assets/images/borde-para-cuadros-de-marco.png",
  },
];

export default function Store() {
  return (
    <div className="h-screen">
    <Navbar />

    <div className="min-h-screen bg-white text-black p-10">
      <h1 className="text-3xl font-bold mb-6">Tienda</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="bg-gray-300 p-4 rounded-xl shadow-lg">
            <CardContent>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h2 className="mt-4 text-xl font-semibold">{product.name}</h2>
              <p className="text-lg font-bold text-green-600">{product.price} MXN</p>
              <div className="mt-4 flex gap-2">
                <Button className="bg-white text-black p-2 rounded">
                    Comprar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </div>
  );
}
