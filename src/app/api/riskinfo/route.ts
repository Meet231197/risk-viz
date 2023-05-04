import Papa, { ParseResult } from "papaparse"
import fs from 'fs';
import getDecades, { getCSVData } from "./utils";
import { stringify } from "querystring";
import { RiskData } from "../../../../risk-data";
import { RiskDataObject } from "../../../../risk-data/RiskDataType";

export async function GET(request: Request) {
  
  const dataString = await getCSVData('./public/workSampleData.csv');
  const dataStringWithDecades:RiskDataObject = {data: dataString, decadeRange: getDecades(dataString)};

  return new Response(JSON.stringify(dataStringWithDecades));
}

export async function POST(request: Request) {

  const body = await request.json();
  console.log(body.year);


  try {
    if (
      body &&
      "year" in body &&
      typeof body.year === "number"
    ) {

      const dataString:RiskData[] = await getCSVData('./public/workSampleData.csv');
      let filteredDataStringWithDecades:RiskDataObject = {data: dataString, decadeRange: getDecades(dataString)};
      if (request.body) {
        const filteredData = dataString.filter((item: RiskData) => {
          return item["Year"] === (body.year as number).toString();
        });
        filteredDataStringWithDecades = {data: filteredData, decadeRange: filteredDataStringWithDecades.decadeRange};
      }

      return new Response(JSON.stringify(filteredDataStringWithDecades))
    }
    throw new Error("number_one or number_two is not a number");
  } catch (err) {
    return new Response("Unable to complete the request, ensure valid decades are provided", { status: 400 });
  }

}
