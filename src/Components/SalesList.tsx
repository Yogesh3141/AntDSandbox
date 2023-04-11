import Title from "antd/es/typography/Title";
import React from "react";
import SalesServices from "../Services/SalesServices";
import { Spin, Table, Input, Select, DatePicker, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { EditTwoTone, SaveTwoTone } from "@ant-design/icons";

enum SalesCategoryType {
  Mobile = 1,
  Laptop = 2,
  PersonalComputer = 3,
  Workstation = 4,
  Server = 5,
  Other = 6,
}

const displaySalesCategoryType = new Map<SalesCategoryType, string>([
  [SalesCategoryType.Mobile, "Mobile"],
  [SalesCategoryType.Laptop, "Laptop"],
  [SalesCategoryType.PersonalComputer, "PersonalComputer"],
  [SalesCategoryType.Workstation, "Workstation"],
  [SalesCategoryType.Server, "Server"],
  [SalesCategoryType.Other, "Other"],
]);

interface ISalesRow {
  id?: string;
  key: string;
  customerName: string;
  amount: number;
  category: SalesCategoryType;
  date: string;
  isEdit?: boolean;
}

const SalesList = () => {
  const defaultValue: ISalesRow = React.useMemo(
    () => ({
      key: "",
      customerName: "",
      amount: 0.0,
      category: SalesCategoryType.Mobile,
      date: new Date().toLocaleDateString("en-GB"),
    }),
    []
  );
  const [salesData, setSalesData] = React.useState<ISalesRow[]>([defaultValue]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<any>({
    customerName: "",
    amount: "",
    date: "",
    hasError: false,
  });

  const salesCategoryOptions = React.useMemo<
    { value: SalesCategoryType; label: string }[]
  >(() => {
    const options: { value: SalesCategoryType; label: string }[] = [];
    displaySalesCategoryType.forEach((val, key) => {
      options.push({ value: key, label: val });
    });
    return options;
  }, []);

  React.useEffect(() => {
    setLoading(true);
    SalesServices.getList()
      .then((res) => {
        if (res.status) {
          //Toast
          console.log("success");
          setSalesData([...res.data, salesData[salesData.length - 1]]);
        } else console.log("failed to load sales data");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const columns: ColumnsType<ISalesRow> = [
    {
      title: "Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (val: any, itm: ISalesRow, idx: number) => {
        return (
          <div>
            {itm?.isEdit || idx === salesData.length - 1 ? (
              <>
                <Input
                  placeholder="Customer name"
                  value={itm?.customerName}
                  onChange={(e: any) => {
                    const newVal = e?.target.value;
                    const newData = [...salesData];
                    newData[idx].customerName = newVal;
                    setSalesData(newData);
                  }}
                />
                {errors?.hasError && !!errors?.customerName && (
                  <div className='text-error'>{errors.customerName}</div>
                )}
              </>
            ) : (
              itm?.customerName
            )}
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (val: any, itm: ISalesRow, idx: number) => {
        return (
          <div>
            {itm?.isEdit || idx === salesData.length - 1 ? (
              <>
                <Input
                  placeholder="Amount"
                  value={itm?.amount}
                  type="number"
                  onChange={(e: any) => {
                    let newVal = parseFloat(e?.target.value);
                    if (isNaN(newVal)) newVal = 0.0;
                    const newData = [...salesData];
                    newData[idx].amount = newVal;
                    setSalesData(newData);
                  }}
                />
                {errors?.hasError && !!errors?.amount && (
                  <div className='text-error'>{errors.amount}</div>
                )}
              </>
            ) : (
              itm?.amount
            )}
          </div>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (val: any, itm: ISalesRow, idx: number) => {
        return (
          <div>
            {itm?.isEdit || idx === salesData.length - 1 ? (
              <Select
                value={itm?.category}
                style={{ width: 120 }}
                onChange={(val: SalesCategoryType) => {
                  const newData = [...salesData];
                  newData[idx].category = val;
                  setSalesData(newData);
                }}
                options={salesCategoryOptions}
              />
            ) : (
              itm?.category
            )}
          </div>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (val: any, itm: ISalesRow, idx: number) => {
        return (
          <div>
            {itm?.isEdit || idx === salesData.length - 1 ? (
              <>
                <DatePicker
                  value={!!itm?.date ? dayjs(itm.date, "DD/MM/YYYY") : null}
                  format={"DD/MM/YYYY"}
                  onChange={(date: any, dateString: string) => {
                    console.log(date, dateString);
                    const newData = [...salesData];
                    newData[idx].date = dateString;
                    setSalesData(newData);
                  }}
                />
                {errors?.hasError && !!errors?.date && <div className='text-error'>{errors.date}</div>}
              </>
            ) : (
              itm?.date
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (val: any, itm: ISalesRow, idx: number) => {
        return (
          <div>
            {itm?.isEdit || idx === salesData.length - 1 ? (
              <Button
                icon={<SaveTwoTone />}
                onClick={() => {
                  let hasError = false;
                  if (!itm.customerName) {
                    setErrors((er: any) => ({
                      ...er,
                      customerName: "Name must be provide",
                    }));
                    hasError = true;
                  }
                  if (itm.amount <= 0) {
                    setErrors((er: any) => ({
                      ...er,
                      amount: "Amount must be greater than zero",
                    }));
                    hasError = true;
                  }
                  if (!itm.date) {
                    setErrors((er: any) => ({
                      ...er,
                      date: "Invalid date",
                    }));
                    hasError = true;
                  }
                  if (hasError) {
                    setErrors((er: any) => ({ ...er, hasError }));
                    return;
                  }
                  setLoading(true);
                  SalesServices.saveSale(itm)
                    .then((res) => {
                      if (res.status) {
                        console.log("added");
                        setRefresh(x => !x)
                      } else console.log(res.statusText);
                      setLoading(false);
                    })
                    .catch((err) => {
                      console.error(err);
                      setLoading(false);
                    });
                }}
              />
            ) : (
              <Button icon={<EditTwoTone />} onClick={() => {
                const newData = [...salesData];
                newData[idx].isEdit = true;
                setSalesData(newData);
              }} />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div>
          <Title level={2}>Sales List</Title>
          <Table columns={columns} dataSource={salesData} />
        </div>
      )}
    </>
  );
};

export default SalesList;
