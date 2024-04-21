"use client";
import React, { useEffect, useState } from "react";
import MyAccountTabs from "@/components/MyAccountTabs";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { getCookie } from 'cookies-next';
import { toast } from "react-toastify";

const MyAccountPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState([]);
  const username = getCookie("username");
  
  useEffect(() => {
    const username = getCookie("username");
    setIsLoggedIn(!!username);
  }, []);

if (!isLoggedIn) {
  return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Bitte Logge dich ein, um diesen Inhalt zu sehen.</h2>
      </div>
  );
}

  return (
    <div>
      <Table hideHeader aria-label="MyAccountPage">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>
              <MyAccountTabs />
              <p></p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default MyAccountPage;