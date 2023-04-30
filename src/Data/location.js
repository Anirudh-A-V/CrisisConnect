import hospitals from './hospital.json' assert { type: "json" };

// console.log(hospitals)

const locations = [
    {
        "id": "1",
        "Name": "Thiruvananthapuram Medical College Casualty",
        "Latitude": "8.5235626173231",
        "Longitude": "76.92779843082823"
    },
    {
        "id": "2",
        "Name": "Providence Endocrine & Diabetes Specialty Centre",
        "Latitude": "8.531637201099311",
        "Longitude": "76.92073445398033"
    },
    {
        "id": "3",
        "Name": "Arthro care",
        "Latitude": "8.553169386631982",
        "Longitude": "76.9168770241366"
    },
    {
        "id": "4",
        "Name": "AJ Hospital",
        "Latitude": "8.568460264171739",
        "Longitude": "76.8728721511262",
    },
    {
        "id": "5",
        "Name": "PHC Ulloor",
        "Latitude": "8.545689695701508",
        "Longitude": "76.90785151064188",
    },
    {
        "id": "6",
        "Name": "KJK Hospital and Fertility Research Centre ",
        "Latitude": "8.541649062002989",
        "Longitude": "76.93930896646637",
    },
    {
        "id": "7",
        "Name": "IMB Hospital",
        "Latitude": "8.557553072705618",
        "Longitude": "76.91600709530162",
    },
    {
        "id": "8",
        "Name": "Chest Diseases Hospital",
        "Latitude": "8.519957681977754",
        "Longitude": "76.91425592546955",
    },
    {
        "id": "9",
        "Name": "Station Medicare Centre, S.M.C",
        "Latitude": "8.518760460117843",
        "Longitude": "76.9111570953011",
    },
    {
        "id": "10",
        "Name": "KIMS Hospital",
        "Latitude": "8.514124483422494",
        "Longitude": "76.90953551906179",
    },
    {
        "id": "11",
        "Name": "Anugraham Neurocare",
        "Latitude": "8.515155159821315",
        "Longitude": "76.93520226646604",
    },
    {
        "id": "12",
        "Name": "Janata Clinic",
        "Latitude": "8.543145147473512",
        "Longitude": "76.88653251709788",
    },
    {
        "id": "13",
        "Name": "Cosmopolitan Hospital",
        "Latitude": "8.515576927451734",
        "Longitude": "76.9355663404844",
    },
    {
        "id": "14",
        "Name": "Bethesda Medi Clinic",
        "Latitude": "8.58216156415073",
        "Longitude": "76.92206527844552",
    },
    {
        "id": "15",
        "Name": "Sree Avittam Thirunal Hospital (SAT)",
        "Latitude": "8.522899328238896",
        "Longitude": "76.92476702699017",
    },
    {
        "id": "16",
        "Name": "Jubilee Memorial Hospital",
        "Latitude": "8.501983847806349",
        "Longitude": "76.95231716646585",
    },
    {
        "id": "17",
        "Name": "Meditrina Hospital",
        "Latitude": "8.515435049284127",
        "Longitude": "76.94430206646601",
    },
    {
        "id": "18",
        "Name": "T.M. Medical Centre",
        "Latitude": "8.540779444522087",
        "Longitude": "76.88017924613114",
    },
    {
        "id": "19",
        "Name": "Indian Institute of Diabetes",
        "Latitude": "8.520277754180333",
        "Longitude": "76.9115433333646",
    },
    {
        "id": "20",
        "Name": "Sree Uthradom Thirunal (SUT) Hospital",
        "Latitude": "8.516289702659234",
        "Longitude": "76.94034238111068",
    },
    {
        "id": "21",
        "Name": "Pangappara PHC",
        "Latitude": "8.557487731966711",
        "Longitude": "76.90342844048767",
    },
    {
        "id": "22",
        "Name": "GG Hospital",
        "Latitude": "8.515784145453573",
        "Longitude": "76.9332936597226",
    },
    {
        "id": "23",
        "Name": "Lords Hospital",
        "Latitude": "8.507128807594025",
        "Longitude": "76.91072526952098",
    },
    {
        "id": "24",
        "Name": "Credence Hospital",
        "Latitude": "8.528894974805247",
        "Longitude": "76.93121345398117",
    },
    {
        "id": "25",
        "Name": "Medcare Health Centre",
        "Latitude": "8.5473164527959",
        "Longitude": "76.91687238180678",
    },
    {
        "id": "26",
        "Name": "TSC Hospital Kazhakootam",
        "Latitude": "8.539927478257573",
        "Longitude": "76.8785269221894",
    },
    {
        "id": "27",
        "Name": "CSI Mission Hospital",
        "Latitude": "8.574595515551112",
        "Longitude": "76.86857053380736",
    },
    {
        "id": "28",
        "Name": "General Hospital",
        "Latitude": "8.499618417550836",
        "Longitude": "76.9429911859288",
    },
    {
        "id": "29",
        "Name": "Ananthapuri Hospitals and Research Institute (AHRI)",
        "Latitude": "8.486346756526123",
        "Longitude": "76.92700504053035",
    },
]

let data = []

for (let i = 0; i < hospitals.length; i++) {
    for (let j = 0; j < locations.length; j++) {
        if (hospitals[i].hospital == locations[j].Name) {
            data.push({
                "id": locations[j].id,
                "Name": locations[j].Name,
                "Latitude": locations[j].Latitude,
                "Longitude": locations[j].Longitude,
                "services": hospitals[i].services
            })
        }
    }
}

export default data;