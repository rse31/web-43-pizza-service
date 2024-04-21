import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { setCookie, getCookie } from "cookies-next";

function LoginForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const username = getCookie("username");
    setIsLoggedIn(!!username);
  }, [isOpen]);

  const logout = () => {
    setCookie("username", "", { expires: new Date(0) });
    setIsLoggedIn(false);
  };

  const onSignup = async () => {
    try {
      try {
        const url = `http://localhost/api/auth.php`;
        const response = await toast.promise(
          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }),
          {
            pending: "SignUp...",
            success: "SignUp erflogreich!",
            error: "Fehler SignUp!",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCookie("username", data["username"]);
          onOpenChange();
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error: any) {
        console.log("Signup failed", error.message);
      }
    } catch (error: any) {
      console.log("Signup failed", error.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Button onPress={onOpen} color="primary">
          Login
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Log in
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    variant="bordered"
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                </ModalBody>
                <ModalFooter>
                  <br />
                  <div className="flex justify-center mt-4">
                    <Link href="/register" color="secondary">
                      Regestrieren
                    </Link>
                  </div>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Abbrechen
                  </Button>
                  <Button color="primary" onClick={onSignup}>
                    Log in
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  } else {
    return (
      <Button color="warning" onPress={logout}>
        Logout
      </Button>
    );
  }
}

export default LoginForm;
