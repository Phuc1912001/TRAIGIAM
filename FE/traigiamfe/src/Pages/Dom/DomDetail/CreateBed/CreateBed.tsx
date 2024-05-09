import { useLoading } from '../../../../common/Hook/useLoading';
import { useNotification } from '../../../../common/Hook/useNotification';
import { BedModel } from '@/common/Model/bed';
import { useForm } from 'antd/es/form/Form';
import React from 'react'
import { useLocation } from 'react-router-dom';
import styles from './CreateBed.module.scss'
import axios from 'axios';

interface ICreateBed {
    openCreateBed: boolean;
    setOpenCreateBed: React.Dispatch<React.SetStateAction<boolean>>;
    isEditBed: boolean;
    recallBed: boolean;
    setRecallBed: React.Dispatch<React.SetStateAction<boolean>>;
    resetBed: boolean;
    currentRecordBed?: BedModel;

}


const CreateBed = (props: ICreateBed) => {

    const {
        openCreateBed,
        setOpenCreateBed,
        isEditBed,
        recallBed,
        setRecallBed,
        resetBed,
        currentRecordBed,
    } = props;

    const { state } = useLocation()

    const [form] = useForm();
    const notification = useNotification();
    const { showLoading, closeLoading } = useLoading();
    const onClose = () => {
        setOpenCreateBed(false);
    };

    const handleOnFinish = async () => {
        try {
            showLoading("createBed");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: BedModel = {
                domId: state.idDom,
                roomId: value.roomId,
                bedName: value.bedName
            }
            await axios.post("https://localhost:7120/api/Bed", model);
            notification.success(<div>Tạo Giuong Thành Công.</div>);
            setOpenCreateBed(false);
            setRecallBed(!recallBed);
            closeLoading("createBed");
        } catch (error) {
            closeLoading("createBed");
        }
    };


    const handleOnEdit = async () => {
        try {
            showLoading("editBed");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: BedModel = {
                domId: state.idDom,
                roomId: value.roomId,
                bedName: value.bedName
            }
            await axios.put(`https://localhost:7120/api/Bed/${currentRecordBed?.id}`, model);
            notification.success(<div>Sửa Giuong Thành Công.</div>);
            setOpenCreateBed(false);
            setRecallBed(!recallBed);
            closeLoading("editBed");
        } catch (error) {
            closeLoading("editBed");
        }
    };

    return (
        <div>CreateBed</div>
    )
}

export default CreateBed