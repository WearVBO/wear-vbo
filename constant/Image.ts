import { StaticImageData } from "next/image";
import light from "@/public/Image/light.jpg";

export const Images: { [key: string]: StaticImageData } = {
  light: light,
};

// example of how it would be imported
// then when you want to use
// import { Images } from "@/constant/Image"; -i - import into the desired page
// <Image src={Images.light} alt="light_image" />
