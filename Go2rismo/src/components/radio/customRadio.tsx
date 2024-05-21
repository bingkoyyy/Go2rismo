/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

interface IRadion{
    choices: any[];
    onChange: (e: RadioChangeEvent) => void;
    value:string;
}
export default function CustomRadio(props: IRadion){
    return (
    <Radio.Group onChange={props.onChange} value={props.value}  buttonStyle="solid">
        {props.choices?.map((data,idx) =>(
        <Radio.Button key={idx} value={data}>{data}</Radio.Button>
        ))}
    </Radio.Group>)
}