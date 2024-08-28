import { Button, FileButton, Flex, Group, Image } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Notifications } from "@mantine/notifications";
import { IconDeviceFloppy } from "@tabler/icons-react";
import axios from "axios";
import { useRef, useState } from "react";
import TT from "../../Api";
import Swal from "sweetalert2";

function FormAddItems({ close }) {
  const resetRef = useRef();
  const form = useForm({
    initialValues: {
      img: null,
    },
    validate: {},
  });

  const [File, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    "http://localhost/apisangkhathan/public/uploadimg/noimage.png"
  );

  const handleFileChange = (files) => {
    setFile(files);
    form.setValues({
      img: files,
    });

    if (files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(files);
    } else {
      setFile(null);
      form.setValues({
        img: null,
      });
      setSelectedImage(
        "http://localhost/apisangkhathan/public/uploadimg/noimage.png"
      );
    }
  };

  const clearFile = () => {
    setFile(null);
    form.setValues({
      img: null,
    });
    setSelectedImage(
      "http://localhost/apisangkhathan/public/uploadimg/noimage.png"
    );
    resetRef.current?.();
  };

  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const Submit = (val) => {
    setLoadingSubmit(true);

    if (val.img === null) {
      Notifications.show({
        title: "กรุณาเพิ่มรูปภาพแบนเนอร์",
        autoClose: 1000,
        color: "red",
      });
      setLoadingSubmit(false);
      return;
    }

    const Update = new FormData();
    Update.append("file", val.img);
    Update.append("typeimg", "add");

    axios.post(TT + "Banner/UploadIMG", Update).then((res) => {
      const ress = res.data;
      if (ress[0].message === "success") {
        setLoadingSubmit(false);
        Swal.fire({
          icon: "success",
          title: "เพิ่มแบนเนอร์เรียบร้อย",
          timer: 1500,
          timerProgressBar: true,
          allowOutsideClick: false,
          showConfirmButton: false,
        }).then(() => {
          close();
        });
      }
    });
  };

  return (
    <>
      <form
        style={{ fontWeight: 400 }}
        onSubmit={form.onSubmit((value) => {
          Submit(value);
        })}
      >
        <Flex mah={300} justify={"space-between"} direction={"column"} pt={10}>
          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            รูปภาพแบนเนอร์
          </label>
          {selectedImage && <Image w={150} src={selectedImage} mb={10} />}
          <Group justify={"flex-start"}>
            <FileButton
              fw={400}
              resetRef={resetRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg"
            >
              {(props) => (
                <Button variant="light" color="violet" {...props}>
                  เลือกรูปภาพ
                </Button>
              )}
            </FileButton>
            <Button
              variant="subtle"
              fw={400}
              disabled={!File}
              color="red"
              onClick={clearFile}
            >
              รีเซ็ต
            </Button>
          </Group>
        </Flex>
        <Flex pt={10} justify={"flex-end"} gap={5}>
          <Button
            fw={400}
            color="red"
            variant="subtle"
            onClick={() => {
              close();
            }}
          >
            ยกเลิก
          </Button>{" "}
          <Button
            loading={LoadingSubmit}
            type="submit"
            fw={400}
            color="green"
            leftSection={<IconDeviceFloppy />}
          >
            บันทึก
          </Button>
        </Flex>
      </form>
    </>
  );
}

export default FormAddItems;
