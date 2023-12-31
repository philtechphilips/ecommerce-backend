
export const create = async (schemaName, data) => {
    let newData = new schemaName(data);
    newData = await newData.save();
    return newData;
  };
  
  export const isUnique = async (schemaName, uniqueField) => {
    let data = await schemaName.findOne(uniqueField);
    if (!data) return true;
    return false;
  };
  
  export const countItems = async (schemaName, filter) => {
    let count, data;
    count = await schemaName.countDocuments(filter);
    return count;
  };
  
  export const fetch = async (schemaName, filter = {}, populateOptions = []) => {
    filter = { ...filter, isDeleted: { $ne: true } }
    let populateField = populateOptions.toString();
    let data = await schemaName
      .find(filter)
      .select("-password")
      .populate(`${populateField}`)
      .sort({ createdAt: "desc" })
      .lean();
    return data;
  };
  
 
  
  export const fetchOne = async (schemaName, filter, populateOptions = []) => {
    filter = { ...filter, isDeleted: { $ne: true } } 
    let populateField = populateOptions.toString();
    let data = await schemaName.findOne(filter).populate(`${populateField}`);
    return data;
  }; 
  
  export const update = async (
    schemaName,
    filter,
    data,
    populateOptions = []
  ) => {
    let populateField = populateOptions.toString();
    let updatedData = await schemaName
      .findOneAndUpdate(filter, data, {
        new: true,
        upsert: true,
        omitUndefined: true,
      })
      .populate(`${populateField}`)
      .lean();
    return updatedData;
  };
  
  export const deleteItem = async (schemaName, filter) => {
    let item = await schemaName.findOneAndDelete(filter);
    return item;
  };
  
  export const hardDeleteItem = async (schemaName, filter) => {
    let item = await schemaName.deleteMany(filter);
    return item;
  };
  
  export const updateAll = async (schemaName, filter, data) => {
    let update = await schemaName.updateMany(filter, data, {
      new: true,
      upsert: true,
    });
    return update;
  };
  
  export const selectFetch = async (
    schemaName,
    filter,
    select,
    populateOptions = []
  ) => {
    filter = { ...filter, isDeleted: { $ne: true } }
    let populateField = populateOptions.toString();
    let data = await schemaName
      .find(filter)
      .select(select)
      .populate(`${populateField}`)
      .lean();
    return data;
  };
  

  export const calculateDiscountPercentage = async (sellingPrice, discountedPrice) => {
    const originalPrice = parseInt(sellingPrice) + parseInt(discountedPrice);
    console.log(originalPrice)
    if (originalPrice <= 0 || discountedPrice <= 0 || originalPrice <= discountedPrice) {
      throw new Error("Invalid Prices");
    }
    const discountPercentage = ((discountedPrice) / originalPrice) * 100;
    return discountPercentage;
  }

  export const createSlug = (title) => {
    const lowercaseTitle = title.toLowerCase();

    const slug = lowercaseTitle
      .replace(/[^\w\s-]/g, '') 
      .replace(/\s+/g, '-')    
      .replace(/-+/g, '-'); 
  
    return slug;
  }

  export const fetchInRandomOrder = async (size, schemaName, filter = {}, populateOptions = []) => {
    filter = { ...filter, isDeleted: { $ne: true } }
    let populateField = populateOptions.toString();
    let data = await schemaName
      .aggregate([{$sample: {size}}, { $match: filter }])
      
    return data;
  }
  
 