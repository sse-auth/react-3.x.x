interface IData<T> {
  is(val: string): boolean;
  toString(): string;
  withClientHints(): PromiseLike<T> | T;
  withFeatureCheck(): PromiseLike<T> | T;
}

interface IBrowser extends IData<IBrowser> {
  name?: string;
  version?: string;
  major?: string;
  type?: 'crawler' | 'cli' | 'email' | 'fetcher' | 'inapp' | 'mediaplayer' | 'library';
}

interface ICPU extends IData<ICPU> {
  architecture?:
    | 'ia32'
    | 'ia64'
    | 'amd64'
    | 'arm'
    | 'arm64'
    | 'armhf'
    | 'avr'
    | 'avr32'
    | 'irix'
    | 'irix64'
    | 'mips'
    | 'mips64'
    | '68k'
    | 'pa-risc'
    | 'ppc'
    | 'sparc'
    | 'sparc64';
}

interface IDevice extends IData<IDevice> {
  type?: 'mobile' | 'tablet' | 'console' | 'smarttv' | 'wearable' | 'xr' | 'embedded';
  vendor?: string;
  model?: string;
}

interface IEngine extends IData<IEngine> {
  name?:
    | 'Amaya'
    | 'ArkWeb'
    | 'Blink'
    | 'EdgeHTML'
    | 'Flow'
    | 'Gecko'
    | 'Goanna'
    | 'iCab'
    | 'KHTML'
    | 'LibWeb'
    | 'Links'
    | 'Lynx'
    | 'NetFront'
    | 'NetSurf'
    | 'Presto'
    | 'Servo'
    | 'Tasman'
    | 'Trident'
    | 'w3m'
    | 'WebKit';
  version?: string;
}

interface IOS extends IData<IOS> {
  name?: string;
  version?: string;
}

interface IResult extends IData<IResult> {
  ua: string;
  browser: IBrowser;
  cpu: ICPU;
  device: IDevice;
  engine: IEngine;
  os: IOS;
}

type RegexMap = (RegExp | string | (string | RegExp | Function)[])[][];
type UAParserProps = 'browser' | 'cpu' | 'device' | 'engine' | 'os';
type UAParserExt =
  | Partial<Record<UAParserProps, RegexMap>>
  | Partial<Record<UAParserProps, RegexMap>>[];
type UAParserHeaders = Record<string, string>;
//   | IncomingHttpHeaders
//   | FetchAPIHeaders;
