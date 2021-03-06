import { IonIcon, IonSkeletonText } from "@ionic/react";
import { sad } from "ionicons/icons";
import React, { Suspense } from "react";
import { useImage } from "react-image";
import Centered from "./Centered";

class ImageErrorBoundary extends React.Component<any, {
  hasError: boolean
}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log("Error loading image", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Centered fullHeight style={{
          background: "var(--ion-color-light)",
          borderRadius: "50%",
          fontSize: "4em",
        }}>
          <IonIcon icon={sad} color="danger" />
        </Centered>
      );
    }

    return this.props.children;
  }
}


const MyImageComponent: React.FC<{
  srcList: any,
  alt: string,
  className?: string,
}> = ({
  srcList,
  alt,
  className
}) => {
    const { src } = useImage({
      srcList,
    })

    return <img src={src} {...{ className, alt }} />
  }

const LazyImage: React.FC<{
  src: string,
  alt: string,
  className?: string,
}> = (props) => {
  return (
    <ImageErrorBoundary>
      <Suspense fallback={<IonSkeletonText animated className="h100 border-circle" />}>
        <MyImageComponent srcList={props.src} {...props} />
      </Suspense>
    </ImageErrorBoundary>
  );
};

export default LazyImage;