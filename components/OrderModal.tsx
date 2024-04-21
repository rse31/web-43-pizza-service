"use client"
import React from "react";
import { useRouter } from 'next/navigation'
import MyAccountForm from "@/components/MyAccountForm";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import { getCookie} from 'cookies-next';
import { Option } from "@/app/model/models";

function OrderModal({
  selectedPizzas,
  selectedOptions,
  specialRequests,
  user,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const calculateTotalPrice = (selectedPizzas, selectedOptions) => {
    let totalPrice = 0;

    selectedPizzas.forEach((pizza) => {
      totalPrice += parseFloat(pizza.price);
    });

    Object.values(selectedOptions).forEach((option) => {
      if (option !== null) {
        const typedOption = option as Option;
        totalPrice += parseFloat(typedOption.price.toString());
      }
    });

    return totalPrice.toFixed(2);
  };

  const handleConfirmOrder = async () => {
    onClose();

    const totalOrderPrice = calculateTotalPrice(
      selectedPizzas,
      selectedOptions
    );

    const orderData = {
      user_id: getCookie("username"),
      total_price: totalOrderPrice,
      pizzas: selectedPizzas.map((pizza) => ({
        pizza_id: pizza.pizza_id,
        quantity: 1,
        toppings: Object.values(selectedOptions)
          .filter((topping) => topping !== null)
          .map((topping) => topping.topping_id),
      })),
      specialRequests: specialRequests
    };

    try {
      const url = `http://localhost/api/order.php`;
      const response = await toast.promise(
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }),
        {
          pending: "Bestellung wird ausgeführt...",
          success: "Bestellung war erfolgreich!",
          error: "Es ist ein Fehler auftreten, bitte versuche es noch einmal!",
        }
      );

      if (response.ok) {
        const data = await response.json();
        router.push(
          "/orderConfirmation?" + createQueryString("id", data.order_id)
        );
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Order failed", error);
    }
  };

  const createQueryString = (name, value) => {
    const params = new URLSearchParams();
    params.set(name, value);
    return params.toString();
  };

  const totalOrderPrice = calculateTotalPrice(selectedPizzas, selectedOptions);

  const renderSelectedItems = () => {
    const items = [];
    if (selectedPizzas.length > 0) {
      selectedPizzas.forEach((pizza) => {
        items.push(
          <Input
            key={"pizza_" + pizza.pizza_id}
            defaultValue={pizza.name + " - " + pizza.price + "€"}
            type="text"
            label="Ausgewhälte Pizza"
            labelPlacement="outside"
            readOnly
          />
        );
      });
    }

    if (Object.keys(selectedOptions).length > 0) {
      Object.entries(selectedOptions).forEach(([key, option]) => {
        
        const typedOption = option as Option | null;
        if (typedOption !== null) {
          items.push(
            <Input
              key={"topping_" + key}
              defaultValue={`${typedOption.name} - ${typedOption.price} €`}
              type="text"
              label="Ausgewähltes Topping"
              labelPlacement="outside"
              readOnly
            />
          );
        }
      });
    } else if (!selectedPizzas) {
      items.push(<p key="no_selection">No items selected.</p>);
    }

    if (specialRequests) {
      items.push(
        <Input
              key={"specialRequests_" + 1}
              defaultValue={specialRequests}
              type="text"
              label="Sonderwünsche"
              labelPlacement="outside"
              readOnly
            />
      );
    }
    return items;
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Bestellung prüfen
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Beszellung prüfen
          </ModalHeader>
          <ModalBody>
            <div className="flex w-full flex-wrap gap-4">{renderSelectedItems()}</div>
            <div>
              <MyAccountForm user={user} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Abbrechen
            </Button>
            <Button color="primary" onPress={handleConfirmOrder}>
              Bestellung bestätigen - {totalOrderPrice} €
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default OrderModal;
