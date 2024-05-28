export default function() {
  return {
    limitOptions: [
      {
        label: "永久有效",
        value: "1"
      },
      {
        label: "相对时间",
        value: "2"
      },
      {
        label: "指定时间",
        value: "3"
      }
    ],
    roleOptions: [
      { title: "不限制", id: "1" },
      { title: "年", id: "2" },
      { title: "季度", id: "3" },
      { title: "月", id: "4" },
      { title: "周", id: "5" },
      { title: "日", id: "6" }
    ],
    timeOptions: [
      {
        value: "1",
        label: "年"
      },
      {
        value: "2",
        label: "季度"
      },
      {
        value: "3",
        label: "月"
      },
      {
        value: "4",
        label: "周"
      },
      {
        value: "5",
        label: "天"
      }
    ]
  };
}
