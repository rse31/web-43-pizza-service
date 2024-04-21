"use client"
import React, { useState } from 'react';
import { Input, Button, Spacer } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

function RegistrationPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
        street: '',
        postalCode: '',
        role: 'customer', 
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `http://localhost/api/register.php`;
            const response = await toast.promise(
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }),
                {
                    pending: "Konto wird registriert...",
                    success: "Konto erfolgreich erstellt!",
                    error: "Fehler bei der Erstellung des Kontos. Bitte versuchen Sie es erneut!"
                }
            );

            if (response.ok) {
                const data = await response.json();
                router.push("/");
            } else {
                throw new Error("Network response was not ok.");
            }
        } catch (error) {
            console.error("Registration failed", error);
        }
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "500px",
          margin: "auto",
          marginTop: "50px",
        }}
      >
        <Input
          label="First Name"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={handleChange}
          name="firstName"
        />
        <Input
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={handleChange}
          name="lastName"
        />
        <Input
          label="Username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          name="username"
          required
        />
        <Input
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          type="password"
          required
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          name="email"
          type="email"
          required
        />
        <Input
          label="Street"
          placeholder="Enter your street"
          value={formData.street}
          onChange={handleChange}
          name="street"
          required
        />
        <Input
          label="Postal Code"
          placeholder="Enter your postal code"
          value={formData.postalCode}
          onChange={handleChange}
          name="postalCode"
          required
        />
        <Spacer y={1} />
        <Button type="submit" color="primary">
          Register
        </Button>
      </form>
    );
}

export default RegistrationPage;