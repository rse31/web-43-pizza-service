"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Accordion, AccordionItem, Input } from "@nextui-org/react";
import { getCookie} from 'cookies-next';
import {toast} from "react-toastify";

import { Pizza, SelectedOptions, Option } from "../model/models";

import ananas from '../../public/ananas.png';
import artischocken from '../../public/artischocken.png';
import kaese from '../../public/kaese.png';
import knoblauch from '../../public/knoblauch.png';
import peperoni from '../../public/peperoni.png';
import pilze from '../../public/pilze.png';
import salami from '../../public/salami.png';
import schinken from '../../public/schinken.png';
import tomaten from '../../public/tomaten.png';
import zwiebeln from '../../public/zwiebeln.png';

import DropdownWithImages from "@/components/DropdownWithImages";
import OrderModal from "@/components/OrderModal";
import PizzaCard from "@/components/pizzaCard";

import './style.css'

function PizzaPage() {
    const content = {
        ananas: ananas,
        artischocken: artischocken,
        kaese: kaese,
        knoblauch: knoblauch,
        peperoni: peperoni,
        pilze: pilze,
        salami: salami,
        schinken: schinken,
        tomaten: tomaten,
        zwiebeln: zwiebeln,
    };
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({ dropwdownItem: null });
    const [specialRequests, setSpecialRequests] = useState('');
    const [pizzas, setPizzas] = useState<Pizza[]>([]);
    const [selectedPizzas, setSelectedPizzas] = useState<Pizza[]>([]);
    const [topings, setTopings] = useState([]);
    const [user, setUser] = useState([]);
    
    const handleSpecialRequestsChange = (event) => {
      setSpecialRequests(event.target.value);
    };

    const selectOption = (dropdownId: string, option: any) => {
        setSelectedOptions(prev => ({...prev, [dropdownId]: option}));
    };
    const searchParams = useSearchParams() 
    const pizzaId = searchParams.get('pizzaId')

    const togglePizzaSelection = (pizza: Pizza) => {
      const isAlreadySelected = selectedPizzas.some(selectedPizza => selectedPizza.pizza_id === pizza.pizza_id);
      if (isAlreadySelected) {
          setSelectedPizzas(selectedPizzas.filter(selectedPizza => selectedPizza.pizza_id !== pizza.pizza_id));
      } else {
          setSelectedPizzas([...selectedPizzas, pizza]);
      }
  };

    useEffect(() => {
    }, [selectedOptions]);

    useEffect(() => {
      const username = getCookie("username");
      setIsLoggedIn(!!username);
  }, []);

  useEffect(() => {
    const pizzaIdFromQuery = searchParams.get("pizzaId");

    if (pizzaIdFromQuery && pizzas.length > 0) {
      const foundPizza = pizzas.find(
        (pizza) => pizza.pizza_id.toString() === pizzaIdFromQuery
      );
      if (foundPizza) {
        const isAlreadySelected = selectedPizzas.some(
          (selectedPizza) => selectedPizza.pizza_id === foundPizza.pizza_id
        );
        if (!isAlreadySelected) {
          setSelectedPizzas((prevSelectedPizzas) => [
            ...prevSelectedPizzas,
            foundPizza,
          ]);
        }
      }
    }
  }, [pizzas, searchParams]);

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
    }, []);

    useEffect(() => {
      const fetchToppings = async () => {
        try {
          const action = 'getAllTopings'; 
          const url = `http://localhost/api/db.php?action=${encodeURIComponent(action)}`;
          const response = await toast.promise(
            fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }),
            {
              error: 'Fehler beim Laden der Beläge. Versuch es nochmals!'
            }
          );
    
          if (response.ok) {
            const data = await response.json();
            setTopings(data); 
          } else {
            throw new Error('Network response was not ok.');
          }
        } catch (error) {
          console.error("Error fetching toppings:", error);
        }
      };
    
      fetchToppings();
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const username = getCookie("username") || '';
          const url = `http://localhost/api/user.php?userID=${encodeURIComponent(username)}`;
          
          const response = await toast.promise(
            fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }),
            {
              error: 'Fehler beim Laden der User Informationen. Versuch es nochmals!'
            }
          );
    
          if (response.ok) {
            const data = await response.json();
            setUser(data); 
          } else {
            throw new Error('Network response was not ok.');
          }
        } catch (error) {
          console.error("Error fetching pizzas:", error);
        }
      };
    
      fetchData();
    }, []);


    if (!isLoggedIn) {
      return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>You need to be logged in to view this page.</h2>
          </div>
      );
  }

    return (
      <div>
        <Accordion defaultExpandedKeys={["1", "2", "3"]}>
          <AccordionItem key="1" aria-label="Ihr Auswahl" title="Ihr Auswahl">
            <div>
              {Object.entries(selectedOptions).some(
                ([_, option]) => option && (option as Option).name
              ) && (
                <>
                  <h4 style={{ marginBottom: "10px" }}>
                    <b>Ausgewählte Zutaten:</b>
                  </h4>
                  {Object.entries(selectedOptions).map(([dropdownId, option]) =>
                    option && (option as Option).name ? (
                      <p key={dropdownId}>{(option as Option).name}</p>
                    ) : null
                  )}
                </>
              )}
            </div>

            {selectedPizzas.length > 0 ? (
              <>
                <h4 style={{ margin: "10px 0" }}>
                  <b>Ausgewählte Pizzas:</b>
                </h4>
                {selectedPizzas.map((pizza) => (
                  <p key={pizza.pizza_id}>
                    {pizza.name} - {pizza.price}€
                  </p>
                ))}
              </>
            ) : (
              <p>Keine Pizza ausgewählt</p>
            )}

            {specialRequests && (
              <>
                <h4 style={{ margin: "10px 0" }}>
                  <b>Sonderwünsche:</b>
                </h4>
                <p>{specialRequests}</p>
              </>
            )}

            <br />
            <OrderModal
              selectedPizzas={selectedPizzas}
              selectedOptions={selectedOptions}
              specialRequests={specialRequests}
              user={user}
            />
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Wählen Sie Ihre Beläge aus"
            title="Wählen Sie Ihre Beläge aus"
          >
            <Table
              aria-label="Tabelle mit Belägen"
            >
              <TableHeader>
                <TableColumn>Belag 1</TableColumn>
                <TableColumn>Belag 2</TableColumn>
                <TableColumn>Belag 3</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>
                    <DropdownWithImages
                      options={topings}
                      contentMapping={content}
                      onSelectOption={(option: any) =>
                        selectOption("dropdown1", option)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <DropdownWithImages
                      options={topings}
                      contentMapping={content}
                      onSelectOption={(option: any) =>
                        selectOption("dropdown2", option)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <DropdownWithImages
                      options={topings}
                      contentMapping={content}
                      onSelectOption={(option: any) =>
                        selectOption("dropdown3", option)
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>{""}</TableCell>
                  <TableCell>{""}</TableCell>
                  <TableCell>{""}</TableCell>
                </TableRow>
                <TableRow key="3">
                  <TableCell aria-colspan={3} colSpan={3}>
                    <Input
                      type="text"
                      label="Sonderwünsche"
                      placeholder="Extra Käse, ohne Zwiebeln, etc."
                      value={specialRequests}
                      onChange={handleSpecialRequestsChange}
                    />
                  </TableCell>
                  <TableCell className="hidden"> </TableCell>
                  <TableCell className="hidden"> </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionItem>
          <AccordionItem key="3" aria-label="User Info" title="User Info">
            <div className="grid-container">
              {pizzas.map((pizza, index) => (
                <PizzaCard
                  key={pizza.pizza_id}
                  name={pizza.name}
                  price={pizza.price}
                  onClick={() => togglePizzaSelection(pizza)}
                />
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    );
}

export default PizzaPage;
