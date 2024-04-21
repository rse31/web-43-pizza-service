"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PizzaCard from '@/components/pizzaCard';
import { ToastContainer, toast } from "react-toastify";
import { Pizza } from './model/models';

export default function Home() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const action = 'getAllPizza'; 
        const url = `http://localhost/api/db.php?action=${encodeURIComponent(action)}`;
        const response = await toast.promise(
          fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          {
            error: 'Fehler beim Laden der Pizzas. Versuch es nochmals!'
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPizzas(data);
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error("Error fetching pizzas:", error);
      }
    };

    fetchData();
  },[]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    params.set(name, value);

    return params.toString();
  };

  const handlePizzaClick = (pizza: Pizza) => {
    router.push("/pizza" + "?" + createQueryString("pizzaId",pizza.pizza_id.toString()));
  };


  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Willkommen bei PizzaMeister!</h1>
      <p style={{ textAlign: "center" }}>
        Wähle und bestelle deine Lieblingspizza.
      </p>

      <div style={{ width: "100%", maxWidth: "1280px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {pizzas.map((pizza) => (
            <PizzaCard
              onClick={() => handlePizzaClick(pizza)}
              key={pizza.pizza_id}
              name={pizza.name}
              price={pizza.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
