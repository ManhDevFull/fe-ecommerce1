declare module 'sub-vn' {
  export interface Province {
    code: string | number;
    name: string;
  }
  export interface District {
    code: string | number;
    name: string;
    provinceCode: string | number;
  }
  export interface Ward {
    code: string | number;
    name: string;
    districtCode: string | number;
  }
  export function getProvinces(): Province[];
  export function getDistricts(provinceCode: string | number): District[];
  export function getWards(districtCode: string | number): Ward[];
}
