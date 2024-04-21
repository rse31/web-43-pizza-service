import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Accordion, AccordionItem} from "@nextui-org/react";

function OrderCard({order, key, orderDetails}) {
console.log(orderDetails);
return (
  <Card className="max-w-[400px]">
    <CardHeader className="flex gap-3">
      <Image
        alt="nextui logo"
        height={40}
        radius="sm"
        src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
        width={40}
      />
      <div className="flex flex-col">
        <p className="text-md">Bestellung: {order.order_id}</p>
        <p className="text-small text-default-500">
          Datum: {order.order_date}
        </p>
      </div>
    </CardHeader>
    <Divider />
    <CardBody>
      <Accordion>
        <AccordionItem
          key="orderDetails"
          aria-label={`Order ${order.order_id} - ${order.total_price}`}
          title={`Order ${order.order_id} - ${order.total_price}`}
        >
          <p style={{ margin: "10px 0" }}><b>Bestelldetails</b></p>
          {orderDetails.map((detail, index) => (
            <div key={index}>
              <p style={{ margin: "10px 0" }}> <b>Preis:</b> {detail.pizza_price} € </p>
              <p style={{ margin: "10px 0" }}> <b>Pizza:</b> {detail.pizza_name} € </p>
              <p style={{ margin: "10px 0" }}> <b>Toppings:</b></p>
              <ul>
                {detail.toppings &&
                  detail.toppings.map((topping, toppingIndex) => (
                    <li key={toppingIndex}>
                      {topping.name} - {topping.price} € 
                    </li>
                  ))}
              </ul>
            </div>
          ))}
          {order.special_requests && (
            <>
              <p style={{ margin: "10px 0" }}><b>Sonderwünsche:</b></p>
              <p>{order.special_requests}</p>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </CardBody>
    <Divider />
    <CardFooter>
      <Link isExternal showAnchorIcon href="/pizza">
        Neue Bestellung
      </Link>
    </CardFooter>
  </Card>
);
}

export default OrderCard;