"use client"

import React from "react";
import { useSearchParams } from 'next/navigation'

function OrderConfirmationPage() {
    const searchParams = useSearchParams() 
    const orderID = searchParams.get('id')

    return (
        <div style={{ padding: 20, textAlign: "center" }}>
            <h1>Bestellbestätigung</h1>
            <p>Deine Bestellung {orderID} war erfolgreich!</p>
        </div>
    );
}

export default OrderConfirmationPage;


