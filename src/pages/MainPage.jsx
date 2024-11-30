import React, { useContext, useState } from "react";
import { EditorComponent } from "../components";
import { Button, Col, Layout, List, Row } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import AuthContext from "../context/AuthContext";
import DataContext from "../context/DataContext";

const MainPage = () => {
  const { user, logout } = useContext(AuthContext);
  const { data, activeId, setActiveId } = useContext(DataContext);

  const headerStyle = {
    textAlign: "center",
    height: 84,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#ffffff",
    position: "sticky",
    boxShadow:
      "0 1px 2px 0 rgba(0, 0, 0, 0.03),0 2px 6px -1px rgba(0, 0, 0, 0.02),0 2px 4px 0 rgba(0, 0, 0, 0.02)",
    borderBottom: "1px solid #e0e0e0",
  };
  const contentStyle = {
    minHeight: 800,
    backgroundColor: "#fff",
  };
  const siderStyle = {
    textAlign: "center",
    lineHeight: "120px",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 1px 2px 0 rgba(0, 0, 0, 0.03),0 1px 6px -1px rgba(0, 0, 0, 0.02),0 2px 4px 0 rgba(0, 0, 0, 0.02)",
    borderRight: "1px solid #e0e0e0",
  };
  const footerStyle = {
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e0e0e0",
    boxShadow:
      "0 1px 2px 0 rgba(0, 0, 0, 0.03),0 1px 6px -1px rgba(0, 0, 0, 0.02),0 2px 4px 0 rgba(0, 0, 0, 0.02)",
  };
  const layoutStyle = {
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  };

  return (
    <>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Row justify="space-between">
            <Col span={2}>methodology service</Col>
            <Col span={2}></Col>
            <Col span={2}></Col>
            <Col span={2}></Col>
            <Col span={2}></Col>
            <Col span={2}></Col>
            <Col span={2}></Col>
            <Col span={2}></Col>
            <Col span={2}></Col>
            <Col span={2}></Col>
            <Col span={2}>{user?.role}</Col>
            <Col span={2}>
              <Button type="primary" onClick={logout}>
                Выйти
              </Button>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider width="19%" style={siderStyle}>
            <List
              itemLayout="horizontal"
              dataSource={
                user?.role !== "viewer"
                  ? [
                      { id: "new", title: "Добавить новый документ", data: {} },
                      ...data,
                    ]
                  : data
              }
              renderItem={(item) => (
                <List.Item
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    backgroundColor:
                      activeId === item.id ? "#bae7ff" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (activeId !== item.id) {
                      e.currentTarget.style.backgroundColor = "#e6f7ff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeId !== item.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  onClick={() => setActiveId(item.id)}
                >
                  <List.Item.Meta title={item.title} key={item.id} />
                </List.Item>
              )}
            />
          </Sider>
          <Content style={contentStyle}>
            {activeId && (
              <EditorComponent
                isReadOnly={user.role === "viewer"}
                activeId={activeId}
              />
            )}
          </Content>
        </Layout>
        <Footer style={footerStyle}>
          Almaty {new Date().getUTCFullYear()}
        </Footer>
      </Layout>
    </>
  );
};

export default MainPage;
