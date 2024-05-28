import store from "../../store/index";

/**
 * 获取 matched 中的路径 title，并生成面包屑
 * 如果有 query 则取第一个参数附加在 title 上
 * @param matched to.matched[]
 * @param query 参数
 */
export function setBreadcrumbs(matched, query) {
  const temp = [
    {
      title: "首页",
      path: "/"
    }
  ];

  for (let i = 0; i < matched.length; i++) {
    temp.push({
      title: matched[i].meta.title,
      path: matched[i].path
    });
  }
  const last = temp.length - 1;

  const Store = store();
  // 如果有 query 则取第一个参数附加在 title 上
  // Object.keys(query).length && (temp[last].title += "：" + getFirst(query));

  Store.commit("settings/SET_BREADCRUMBS", temp);
}
