import React, { useContext, useEffect, useState } from "react";
import { AuthContext, DataContext } from "../../context";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../api";
import { showMessage } from "../../utils";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  //const { setLoading } = useContext(DataContext);
  const { auth } = useApi();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/main");
    }
  }, [navigate]);

  const onFinish = async () => {
    try {
      //setLoading(true);
      const userData = await auth({
        username: credentials?.username,
        password: credentials?.password,
      });
      login(userData?.access_token);
    } catch (error) {
      showMessage({ content: "", type: "error" });
      console.log(error);
    } finally {
      //setLoading(false);
    }

    // const fakeToken =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiJ9.0qO9T41PyKt3ik0R958N3RD2y9EfvDaTskCV6iOiBRk"; // Замените на реальный запрос к API
    // login(fakeToken);
  };

  const onChangeInput = ({ target }) => {
    const { name, value } = target;
    setCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Form
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            name="username"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="username"
            onChange={onChangeInput}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            name="password"
            placeholder="Password"
            onChange={onChangeInput}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
