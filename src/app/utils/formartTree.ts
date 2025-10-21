import { CategoryTree, ICategory } from "@/types/type";

export  const formatTree = (data: ICategory[]): CategoryTree[] => {
    const items: CategoryTree[] = [];
  
    const buildTree = (parentId: number | null):CategoryTree[] => {
      return data.filter((item: ICategory) => item['idparent'] === parentId)
      .map((item: ICategory) => ({
          namecategory: item.namecategory,
          id: item.id,
          product: item.product,
          children: buildTree(item.id)
        }));
    };
  
    items.push(...buildTree(null));
    return items;
  };