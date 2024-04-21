import React, { useEffect, useState } from "react";
import { Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import { User } from "@/app/model/models";

function MyAccountForm({user}) {

  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    postalCode: '',
    villageName: '',
  });
  
  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        street: user.street || '',
        postalCode: user.postal_code || '',
        villageName: user.village_name || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateUrl = 'http://localhost/api/updateUser.php';
    try {
      const response = await toast.promise(
        fetch(updateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.user_id,
            ...editData
          }),
        }), {
          pending: 'User Informationen werden aktualisiert...',
          success: 'User information wrden erfolgreich aktualisiert!',
          error: 'Es ist ein Fehler beim aktualisieren aufgetreten, versuche es erneut!'
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user information.");
      } 
    } catch (error) {
      toast.error("Es ist ein Fehler beim aktualisieren aufgetreten, versuche es erneut!");
      console.error("Error:", error);
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Table hideHeader aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>
              <Input
                type="text"
                label="Account-ID"
                value={user.user_id.toString() || ""}
              />
            </TableCell>
            <TableCell>
              <p>{user.role}</p>
            </TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>
              <Input
                type="text"
                label="Vorname"
                name="firstName"  
                value={editData.firstName || ""}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                label="Nachname"
                name="lastName"
                value={editData.lastName || ""}
                onChange={handleChange}
              />
            </TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>
              <Input
                type="text"
                label="Straße inkl. Hausnummer"
                name="street"
                value={editData.street || ""}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell>
              <p></p>
            </TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>
              <Input
                type="text"
                label="Postleitzahl"
                name="postalCode"
                value={editData.postalCode || ""}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                label="Ort"
                name="villageName"
                value={editData.villageName}
                onChange={handleChange}
              />
            </TableCell>
          </TableRow>
          <TableRow key="5">
            <TableCell>
              <Input
                type="email"
                label="Email"
                value={user.email || ""}
                placeholder="Enter your email"
                onChange={handleChange}
              />
            </TableCell>
            <TableCell>
              <Button type="submit" color="success" fullWidth>
                Update
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </form>
  );
}

export default MyAccountForm;
