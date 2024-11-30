
declare module 'compress.js' {
  class Compress {
    compress(
      files: File[],
      options: {
        size: number;
        quality: number;
        maxWidth: number;
        maxHeight: number;
        resize: boolean;
      }
    ): Promise<
      {
        data: string;
        ext: string;
        alt: string;
        initialSize: number;
        endSize: number;
        quality: number;
      }[]
    >;
  }
  export default Compress;
}