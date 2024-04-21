"use client";
import React from 'react';
import Image from 'next/image';
import { Card, CardFooter, CardBody } from '@nextui-org/react';
import margherita from '../public/Pizza Margherita.jpg';
import funghi from '../public/Pizza al Funghi.jpg';
import salami from '../public/Pizza Salami.jpg';
import peperoni from '../public/Pizza Peperoni.jpg';
import prosciutto from '../public/Pizza Prosciutto.jpg';
import capriciosa from '../public/Pizza Capriciosa.jpg';
import rimini from '../public/Pizza Rimini.jpg';
import gorgonzola from '../public/Pizza Gorgonzola.jpg';
import hawaii from '../public/Pizza Hawaii.jpg';

const PizzaCard = ({ name, price, onClick }) => {
    const content = {
        'Pizza Margherita': margherita,
        'Pizza al Funghi': funghi,
        'Pizza Salami': salami,
        'Pizza Peperoni': peperoni,
        'Pizza Prosciutto': prosciutto,
        'Pizza Capriciosa': capriciosa,
        'Pizza Rimini':rimini,
        'Pizza Gorgonzola': gorgonzola,
        'Pizza Hawaii': hawaii,
    };
    
    return (
        <Card shadow="sm" isPressable onClick={onClick} style={{ height: '250px', width: '300px' }}>
          <CardBody className="overflow-visible p-0" style={{ height: '250px', width: '300px' }}>
            <Image src={content[name]} alt={name} width={300} height={200} />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{name}</b>
            <p className="text-default-500">{price}</p>
          </CardFooter>
        </Card>
      );
  };

export default PizzaCard