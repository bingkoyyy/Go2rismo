import React from 'react'
import { Card } from 'antd';

interface ICard{
    title: string;
    content: JSX.Element | string;
    addedClass?:string;
}
const CustomCard = (props:ICard) => {
  return (
    <Card className={props.addedClass} title={props.title} extra={<a href="#">View All</a>} style={{ width: 300 }}>
      {props.content}
    </Card>
  )
}

export default CustomCard