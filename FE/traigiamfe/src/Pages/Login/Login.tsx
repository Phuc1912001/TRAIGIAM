import { Button, Col, Form, Input, Row } from "antd";
import styles from "./Login.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useLoading } from "../../common/Hook/useLoading";

interface loginModel {
    username?: string;
    password?: string;
}

const Login = () => {

    const [form] = useForm();
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const navigate = useNavigate();
    const { showLoading, closeLoading } = useLoading();

    const onFinish = async (value: loginModel) => {
        if (isSignUp) {
            const { data } = await axios.post("https://localhost:7120/api/Register/register", value);
            if (data.status) {
                setIsSignUp(false)
            }
        } else {
            const { data } = await axios.post("https://localhost:7120/api/Register/login", value);
            if (data.status) {
                navigate("/prisoner");
            }

        }
    };
    const handleSwitchLogin = async () => {
        setIsSignUp(!isSignUp);
        await form.resetFields();
    };


    return (
        <div className={styles.containerLogin}>
            <div className={styles.modalLogin}>
                <div className={styles.title}>{isSignUp ? "Đăng Ký" : "Đăng Nhập"}</div>
                <Form layout="vertical" onFinish={onFinish} form={form} >
                    <Row>
                        <Col sm={24}>
                            <Form.Item
                                rules={[{ required: true, message: "Vui lòng điền tên đăng nhập." }]}
                                name="userName"
                                label="Tên Đăng Nhập"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        {isSignUp && (
                            <Col sm={24}>
                                <Form.Item
                                    rules={[
                                        { required: true, message: "Vui lòng điền email" },
                                    ]}
                                    name="email"
                                    label="Email"
                                >
                                    <Input maxLength={150} />
                                </Form.Item>
                            </Col>
                        )}

                        <Col sm={24}>
                            <Form.Item
                                label="Mật Khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng điền mật khẩu' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className={styles.textswitch} onClick={handleSwitchLogin}>
                        {isSignUp ? (
                            <div>Đăng nhập ngay ?</div>
                        ) : (
                            <div>Tạo Tài Khoản ?</div>
                        )}
                    </div>
                    <div className={styles.btnSubmit}>
                        <Button type="primary" htmlType="submit">
                            {isSignUp ? "Đăng Ký" : "Đăng Nhập"}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
