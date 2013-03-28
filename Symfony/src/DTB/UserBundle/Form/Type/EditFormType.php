<?php

namespace DTB\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface;
use FOS\UserBundle\Form\Type\ProfileFormType as BaseType;

class EditFormType extends BaseType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
        parent::buildForm($builder, $options);
        
        //Preventing user from editing its own username
        $builder->remove('username');

        $builder->add('description', 'textarea', array("required" => false));
        $builder->add('firstName', 'text', array("required" => false));
        $builder->add('lastName', 'text',  array("required" => false));
        $builder->add('city', 'text',  array("required" => false));
        $builder->add('birthDate', 'birthday', array("required" => false, 'format' => 'dd - MM - yyyy', 'widget' => 'choice', 'years' => range(date('Y'), date('Y') - 70)));
        $builder->add('facebook', 'text',  array("required" => false));
        $builder->add('twitter', 'text',  array("required" => false));
        $builder->add('skype', 'text',  array("required" => false));
        $builder->add('profilePicture', new \DTB\UserBundle\Form\ProfilePictureType(), array("required" => false, 'label' => "Profile Picture"));
    }

    public function getDefaultOptions(array $options) {
        return array('data_class' => 'FOS\UserBundle\Form\Model\CheckPassword');
    }

    public function getName() {
        return 'dtb_edit_profile';
    }

}

?>
