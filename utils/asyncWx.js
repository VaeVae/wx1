//获取设置
/**
 * promist形式的getSetting
 * @param {}  
 */
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            },
        });
    })
}
// 打开设置
/**
 * promist形式的openSetting
 * @param {}  
 */
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            },
        });
    })
}
// 获取地址
/**
 * promist形式的chooseAddress
 * @param {}  
 */
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            },
        });
    })
}
// 显示弹窗
/**
 * promist形式的showModal
 * @param {object} content 
 */
export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content,
            success: (result) => {
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            },
        });
    })
}
// 显示提示框
/**
 * promise类型的showToast
 * @param {object}
 */
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title,
            icon: 'none',
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            },
        });
    })
}