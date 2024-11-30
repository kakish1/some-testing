import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import { Button, Col, Input, Modal, Row, Splitter, Switch, Upload } from "antd";
import { DataContext } from "../../context";
import { useApi } from "../../api";
import { showMessage } from "../../utils";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";

const EditorComponent = ({ isReadOnly, activeId }) => {
  const { getContentById, uploadPdf, updateContentById, updateContentTitle } =
    useApi();
  const { setLoading } = useContext(DataContext);
  const [currentData, setCurrentData] = useState({});
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");

  const ejInstance = useRef(null);

  const initEditor = useCallback(() => {
    if (ejInstance.current) return;

    const editor = new EditorJS({
      holder: "editorjs",
      readOnly: isReadOnly,
      onReady: () => {
        ejInstance.current = editor;
      },
      autofocus: true,
      data: currentData?.editorjs_data,
      // onChange: async () => {
      //   const content = await editor.saver.save();
      //   setCurrentData(content);
      // },
      tools: {
        header: Header,
        simpleImage: SimpleImage,
        list: List,
        checklist: CheckList,
        quote: Quote,
        warning: Warning,
        marker: Marker,
        code: Code,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        linkTool: LinkTool,
        embed: Embed,
        table: Table,
      },
      i18n: {
        messages: {
          ui: {
            blockTunes: {
              toggler: {
                "Click to tune": "Нажмите, чтобы настроить",
                "or drag to move": "или перетащите",
              },
            },
            inlineToolbar: {
              converter: {
                "Convert to": "Конвертировать в",
              },
            },
            toolbar: {
              toolbox: {
                Add: "Добавить",
              },
            },
          },
          toolNames: {
            Text: "Параграф",
            Heading: "Заголовок",
            List: "Список",
            Warning: "Примечание",
            Checklist: "Чеклист",
            Quote: "Цитата",
            Code: "Код",
            Delimiter: "Разделитель",
            Raw: "HTML-фрагмент",
            Table: "Таблица",
            Link: "Ссылка",
            Marker: "Маркер",
            Bold: "Полужирный",
            Italic: "Курсив",
            InlineCode: "Моноширинный",
          },
          tools: {
            warning: { Title: "Название", Message: "Сообщение" },
            link: { "Add a link": "Вставьте ссылку" },
            stub: {
              "The block can not be displayed correctly.":
                "Блок не может быть отображен",
            },
          },
          blockTunes: {
            delete: { Delete: "Удалить" },
            moveUp: { "Move up": "Переместить вверх" },
            moveDown: { "Move down": "Переместить вниз" },
          },
        },
      },
    });
  }, [isReadOnly, currentData?.editorjs_data]);

  useEffect(() => {
    initEditor();
    return () => {
      ejInstance.current?.destroy();
      ejInstance.current = null;
    };
  }, [initEditor]);

  useEffect(() => {
    if (
      ejInstance.current &&
      JSON.stringify(ejInstance.current.data) !==
        JSON.stringify(currentData?.editorjs_data)
    ) {
      ejInstance.current.render(currentData?.editorjs_data);
    }
  }, [currentData?.editorjs_data]);

  useEffect(() => {
    const controller = new AbortController();
    if (!activeId) return;
    if (activeId === "new") {
      setCurrentData({ title: "", data: {} });
      return;
    }

    const getData = async () => {
      try {
        setLoading(true);
        const data = await getContentById(activeId, {
          signal: controller.signal,
        });
        setCurrentData(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          showMessage({
            content: `Не удалось загрузить статью - ${error}`,
            type: "error",
          });
          setCurrentData({});
        }
      } finally {
        setLoading(false);
      }
    };

    getData();

    return () => {
      controller.abort();
      setCurrentData({ title: "", data: {} });
    };
  }, [activeId]);

  const handleOk = async () => {
    const formData = new FormData();
    formData.append("file", fileList.file);
    setIsModalOpen(false);
    setUploading(true);
    setLoading(true);
    try {
      const uploadRes = await uploadPdf(title, formData);
      setCurrentData(uploadRes);
      setFileList([]);
      showMessage({ content: "upload successfully.", type: "success" });
    } catch (error) {
      showMessage({ content: "upload failed.", type: "error" });
      setFileList([]);
      setCurrentData({ title: "", data: {}, editorjs_data: {} });
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  const props = {
    beforeUpload: () => {
      return false;
    },
    onChange: (files) => {
      setFileList(files);
      setIsModalOpen(true);
    },
    multiple: false,
    fileList: [],
  };

  // const handleOk = async () => {
  //   setLoading(true);
  //   try {
  //     const upload = await postContent(currentData);
  //     showMessage({
  //       content: `Вы успешно загрузили статью - ${upload}`,
  //       type: "success",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     showMessage({
  //       content: `Не удалось загрузить статью - ${error}`,
  //       type: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSave = async () => {
    setLoading(true);
    try {
      const content = await ejInstance.current.saver.save();
      const [_, updContentRes] = await Promise.all([
        updateContentTitle(currentData?.id, currentData?.title),
        updateContentById(currentData?.id, {
          id: currentData?.id,
          title: currentData?.title,
          owner_id: currentData?.owner_id,
          data: content,
        }),
      ]);
      console.log(updContentRes?.data);
      setCurrentData((prev) => {
        return {
          ...prev,
          data: updContentRes?.data,
        };
      });
    } catch (error) {
      showMessage({ content: `Error while save current doc - ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const handleTurnJsonMode = async (checked) => {
    setIsJsonMode(checked);
    if (!checked) return;

    try {
      await handleSave();
    } catch (error) {
      showMessage({ content: `Error while opening json mode - ${error}` });
    }
  };

  return (
    <>
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Enter Title For New Doc"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </Modal>
      {!isReadOnly && (
        <Row style={{ margin: "5px" }}>
          <Col span={3}>
            <Switch
              size="default"
              checked={isJsonMode}
              onChange={(checked) => handleTurnJsonMode(checked)}
              checkedChildren="Disable JSON View"
              unCheckedChildren="Enable JSON View"
            />
          </Col>
          {activeId === "new" && (
            <Col span={8}>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Col>
          )}
        </Row>
      )}

      <Row style={{ margin: "5px" }}>
        <Col span={10}>
          <Input
            placeholder="Enter Title"
            value={currentData?.title}
            onChange={({ target }) =>
              setCurrentData((prev) => {
                return {
                  ...prev,
                  title: target.value,
                };
              })
            }
          />
        </Col>
        {!isReadOnly && (
          <Col span={5} style={{ marginLeft: "15px" }}>
            <Button icon={<SaveOutlined />} onClick={handleSave}>
              Save
            </Button>
          </Col>
        )}
      </Row>

      <Splitter
        layout="horizontal"
        style={{ height: 900, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel size={isJsonMode ? "70%" : "100%"}>
          <div id="editorjs"></div>
        </Splitter.Panel>
        <Splitter.Panel size={isJsonMode ? "30%" : "0%"}>
          <textarea
            value={JSON.stringify(currentData?.data, null, 2)}
            onChange={(e) => {
              try {
                setCurrentData(JSON.parse(e.target.value));
              } catch (err) {
                console.error("Invalid JSON");
              }
            }}
            style={{
              backgroundColor: "#d5d2d2",
              width: "100%",
              height: "100%",
              border: "none",
              resize: "none",
            }}
            readOnly
          />
        </Splitter.Panel>
      </Splitter>
    </>
  );
};

export default memo(EditorComponent);
