import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import MyAccountForm from "@/components/MyAccountForm";
import OrderCard from "@/components/OrderCard";
import { getCookie } from 'cookies-next';
import { toast } from "react-toastify";
import { Order, User } from "@/app/model/models";

function MyAccountTabs() {
  const [selected, setSelected] = useState("photos");
  const [orders, setOrders] = useState<Order[]>([]); 
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = getCookie("username");
        if (!username) {
          console.error("Username cookie not found");
          return;
        }

        const url = `http://localhost/api/user.php?userID=${encodeURIComponent(username)}`;

        const response = await toast.promise(fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }), {
          error: 'Fehler beim Laden der Benutzerdaten. Versuch es nochmals!'
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []); 

  useEffect(() => {
    const username = getCookie("username");
    if (username) fetchOrders(username);
  }, []);
  
  const fetchOrders = async (username) => {
    try {
      const url = `http://localhost/api/user.php?userID=${encodeURIComponent(username)}&orders=true`;
  
      const response = await toast.promise(fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }), {
        error: 'Fehler beim Laden der Bestelldaten. Versuch es nochmals!'
      });
  
      if (response.ok) {
        const data = await response.json();
        setOrders(data); 
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  
  const handleSelectionChange = (key) => {
    if (typeof key === 'string' || typeof key === 'number') {
      setSelected(key.toString());
    }
  };

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={handleSelectionChange}
      >
        <Tab key="myAccount" title="MyAccount">
          <Card>
            <CardBody>
              <MyAccountForm user={user} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="bestellungen" title="Bestellungen">
          <Card>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  justifyContent: "space-evenly",
                }}
              >
                {orders.map((order) => (
                  
                  <div
                    key={order.orderId}
                    style={{
                      flex: "1 0 calc(50% - 10px)",
                      maxWidth: "calc(50% - 10px)",
                    }}
                  >
                    <OrderCard
                      key={order.orderId}
                      order={order}
                      orderDetails={order.details}
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

export default MyAccountTabs;